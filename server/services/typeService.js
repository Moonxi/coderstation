const {
  findAllTypeDao,
  addTypeDao,
  deleteTypeDao,
  updateTypeDao,
} = require("../dao/typeDao");
const {
  deleteIssuesByTypeIdDao
} = require("../dao/issueDao.js");
const {
  deleteBooksByTypeIdDao
} = require("../dao/bookDao.js");
const {
  deleteCommentsByIssueIdDao,
  deleteCommentsByBookIdDao
} = require("../dao/commentDao.js");
const {
  deleteInterviewsByTypeIdDao
} = require("../dao/interviewDao.js");

const { validate } = require("validate.js");
const { typeRule } = require("./rules");
const { ValidationError } = require("../utils/errors");

/**
 * 查询所有类型
 */
module.exports.findAllTypeService = async function () {
  return await findAllTypeDao();
};

/**
 * 增加类型
 */
module.exports.addTypeService = async function (newTypeInfo) {
    // 首先要进行验证，查看该类型是否已经存在
    return validate.async(newTypeInfo, typeRule).then(async function(){
        return await addTypeDao(newTypeInfo);
    },function(){
        return new ValidationError("数据验证失败"); 
    })
};

/**
 * 根据 id 删除类型
 */
module.exports.deleteTypeService = async function (id) {
  // 删除类型需要删除该类型下的所有问答、书籍和面试题

  // 删除该类型下的所有问答
  const issues = await deleteIssuesByTypeIdDao(id)
  // 删除该类型下的所有书籍
  const books = await deleteBooksByTypeIdDao(id)
  // 删除所有问答和书籍下的评论
  for (const issue of issues) {
    await deleteCommentsByIssueIdDao(issue._id)
  }
  for (const book of books) {
    await deleteCommentsByBookIdDao(book._id)
  }
  // 删除该类型下的所有面试题
  await deleteInterviewsByTypeIdDao(id)

  return await deleteTypeDao(id);
};

/**
 * 根据 id 修改类型
 */
module.exports.updateTypeService = async function (id, newInfo) {
  return await updateTypeDao(id, newInfo);
};
