var workgroupsActions = {};

workgroupsActions.addTag = function (tag) {  
  return {
    type: "ADD_TAG",
    payload: {
      tag: tag
    }
  };
}

workgroupsActions.removeTag = function (tag) {  
  return {
    type: "REMOVE_TAG",
    payload: {
      tag: tag
    }
  };
}

workgroupsActions.updateTag = function (tag) {  
  return {
    type: "UPDATE_TAG",
    payload: {
      tag: tag
    }
  };
}