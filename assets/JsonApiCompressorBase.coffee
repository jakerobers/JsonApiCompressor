class JsonApiCompressorBase
  parent: null
  object: null
  output: null

  constructor: (object, parent)->
    unless _.isObject(object) || _.isArray(object)
      throw new Error("Object was not passed into JsonApiCompressor.")
    unless (object.type || _.isString(object.type)) || (object[0].type && _.isString(object[0].type))
      throw new Error("The type for an object must be defined as a string.")
    unless object.id || object[0].id
      throw new Error("The id for an object is undefined.")
    #END unless

    @object = object
    @parent = parent
    @output =
      data: {}
      included: []
      links: {}
    #END output
  #END constructor

  attributes: (attributes)->
    unless attributes
      throw new Error("The attributes for an object is undefined.")
    else unless _.isArray(attributes)
      throw new Error("The attributes for an object must be a list.")
    #END unless

    if _.isObject(@object) && !_.isArray(@object) && !_.isFunction(@object)
      @output.data =
        "id": @object.id
        "type": @object.type
      #END output.data
      @output.data.attributes = _.pick(@object, attributes)
    else if _.isArray(@object)
      @output.data = []
      for node in @object
        data =
          "id": node.id
          "type": node.type
        data.attributes = _.pick(node, attributes)
        @output.data.push(data)
      #END for
    else
      throw new Error("The given object must be an object or array.")
    #END if

    return @
  #END attributes


  relationship: (relName)->
    unless relName
      throw new Error("relationship must be given a parameter.")
    #END unless

    relObj = @object[relName]

    unless relObj
      throw new Error("Relationship object is not defined.")
    #END unless

    if !_.isObject(relObj) || (_.isArray(relObj) && _.isEmpty(relObj))
      throw new Error("Relationship object must be an object, or an array with at least one index.")
    #END if

    unless relObj.type || (_.isArray(relObj) && relObj[0].type)
      throw new Error("Relationship object type is not defined.")
    #END unless

    ### Set the defaults ###
    @output.data.relationships = {} unless @output.data.relationships
    @output.data.relationships[relName] = {} unless @output.data.relationships[relName]
    @output.data.relationships[relName].data = {} unless @output.data.relationships[relName].data

    unless _.isArray(relObj)
      relObj = [relObj]
    #END unless

    for relNode in relObj
      relToBeAdded = type: relNode.type
      relToBeAdded.id = relNode.id if relNode.id?

      if _.isEmpty(@output.data.relationships[relName].data)
        @output.data.relationships[relName].data = relToBeAdded
      else if _.isObject(@output.data.relationships[relName].data) && !_.isArray(@output.data.relationships[relName].data) && !_.isFunction(@output.data.relationships[relName].data)
        @output.data.relationships[relName].data = [@output.data.relationships[relName].data]
        @output.data.relationships[relName].data.push(relToBeAdded)
      else if _.isArray(@output.data.relationships[relName].data)
        @output.data.relationships[relName].data.push(relToBeAdded)
      else
        throw new Error("object." + relName + ".data must be an array or object.")
      #END if

    return new JsonApiCompressorBase(@object[relName], @)
  #END relationship

  done: ()->
    if !_.isObject(@output.data) || _.isFunction(@output.data)
      throw new Error("Output data did not convert properly: " + @output.data)
    #END if

    ### Load into included ###
    if _.isArray(@output.data)
      for node in @output.data
        @parent.output.included.push node
      #END for
    else
      @parent.output.included.push @output.data
    #END if

    return @parent
  #END done

#END JsonApiConpressorBase
