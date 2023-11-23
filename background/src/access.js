export default initialState => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  const canSeeAdmin = !!(initialState && initialState.name !== 'dontHaveAccess')

  const enabled = !!(initialState && initialState.enabled)
  const superAdmin = !!(initialState && initialState.permission === 1 && enabled)
  const normalAdmin = !!(initialState && initialState.permission === 2 && enabled) || superAdmin
  const admin = !!(initialState && initialState.permission && enabled) || normalAdmin || superAdmin
  return {
    canSeeAdmin,
    enabled,
    superAdmin,
    normalAdmin,
    admin
  }
}
