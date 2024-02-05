function allocateId(name) {
  return name + '-' + new Date().getTime().toString(36) + '-' + Math.random().toString(36).substring(2, 11);
}

module.exports = {
  allocateId
}
