class JsonApiCompressorBase
  parent: null
  object: null
  output: null

  constructor: (object, parent)->
    unless _.isObject(object)
      return new Error("Object was not passed into JsonApiCompressor.")
    unless object.type || _.isString(object.type)
      return new Error("The type for an object must be defined as a string.")
    unless object.id
      return new Error("The id for an object is undefined.")
    #END unless

    @object = object
    @parent = parent
    @output =
      data: {}
      included: {}
      links: {}
    #END output
  #END constructor

  attributes: (attributes)->
    unless attributes
      return new Error("The attributes for an object is undefined.")
    else unless _.isArray(attributes)
      return new Error("The attributes for an object is undefined.")
    #END unless

    @output.data =
      "id": @object.id
      "type": @object.type
    #END output.data

    @output.data.attributes = _.pick(@object, attributes)

    return @
  #END attributes


  relationship: (relName)->
    unless relName
      return new Error("relationship must be given a parameter.")
    #END unless

    relObj = @object.relName
    unless relObj
      return new Error("Relationship object is not defined.")
    else unless relObj.type
      return new Error("Relationship object type is not defined.")
    #END unless

    ### Set the defaults ###
    @output.data.relationships = {} unless @output.data.relationships
    @output.data.relationships[relName] = {} unless @output.data.relationships[relName]
    @output.data.relationships[relName].data = {} unless @output.data.relationships[relName].data

    relToBeAdded = type: relObj.type
    relToBeAdded.id = relObj.id if relObj.id?

    if _.isEmpty(@output.data.relationships[relName].data)
      @output.data.relationships[relName].data = relToBeAdded
    else if _.isObject(@output.data.relationships[relName].data)
      @output.data.relationships[relName].data = [@output.data.relationships[relName].data]
      @output.data.relationships[relName].data.push(relToBeAdded)
    else if _.isArray(@output.data.relationships[relName].data)
      @output.data.relationships[relName].data.push(relToBeAdded)
    else
      return new Error("object." + relName + ".data must be an array or object.")
    #END if
    return new JsonApiConpressorBase(@object[relName], @)
  #END relationship

  done: ()->
  #END done

#END JsonApiConpressorBase



