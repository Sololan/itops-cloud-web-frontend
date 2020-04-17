const { parse } = require("url");

const getUsers = [
  {
    id: 0,
    username: 'username00',
    fullName: 'name00',
    roleId: '1',
    phone: 1,
    email: 'ee@ee.com',
    creteTime: '2016-05-02',
  },
  {
    id: 1,
    username: 'username01',
    fullName: 'name01',
    roleId: '1',
    phone: 1,
    email: 'ee@ee.com',
    creteTime: '2016-05-02',
  },
  {
    id: 2,
    username: 'username02',
    fullName: 'name02',
    roleId: '1',
    phone: 1,
    email: 'ee@ee.com',
    creteTime: '2016-05-03',
  },
  {
    id: 3,
    username: 'username03',
    fullName: 'name03',
    roleId: '1',
    phone: 1,
    email: 'ee@ee.com',
    creteTime: '2016-05-03',
  },
  {
    id: 4,
    username: 'username04',
    fullName: 'name04',
    roleId: '1',
    phone: 1,
    email: 'ee@ee.com',
    creteTime: '2016-05-03',
  },
  {
    id: 5,
    username: 'username05',
    fullName: 'name05',
    roleId: '1',
    phone: 1,
    email: 'ee@ee.com',
    creteTime: '2016-05-03',
  },
  {
    id: 6,
    username: 'username06',
    fullName: 'name06',
    roleId: '1',
    phone: 1,
    email: 'ee@ee.com',
    creteTime: '2016-05-03',
  },
  {
    id: 7,
    username: 'username07',
    fullName: 'name07',
    roleId: '1',
    phone: 1,
    email: 'ee@ee.com',
    creteTime: '2016-05-03',
  },
  {
    id: 8,
    username: 'username08',
    fullName: 'name08',
    roleId: '1',
    phone: 1,
    email: 'ee@ee.com',
    creteTime: '2016-05-03',
  },
  {
    id: 9,
    username: 'username09',
    fullName: 'name09',
    roleId: '1',
    phone: 1,
    email: 'ee@ee.com',
    creteTime: '2016-05-03',
  },
  {
    id: 10,
    username: 'username10',
    fullName: 'name10',
    roleId: '1',
    phone: 1,
    email: 'ee@ee.com',
    creteTime: '2016-05-03',
  },
  {
    id: 11,
    username: 'username11',
    fullName: 'name11',
    roleId: '1',
    phone: 1,
    email: 'ee@ee.com',
    creteTime: '2016-05-03',
  },
  {
    id: 12,
    username: 'username12',
    fullName: 'name12',
    roleId: '1',
    phone: 1,
    email: 'ee@ee.com',
    creteTime: '2016-05-04',
  },
];

function deleteUserById(id) {
  getUsers.splice(id, 1); //index = id, delete by index
}
function updateUserById(req) {
  getUsers[req.params.id] = req.body
}

function addUser(user) {
  user.id = getUsers.length;
  getUsers.push(user);
}

const getRoles = [
  {
    value: '1',
    label: '普通用户'
  }, {
    value: '2',
    label: '超级管理员'
  }
]

module.exports = {
  // 以HTTP动词和URL为Key，映射一个处理句柄。
  "GET /site/uc/api/users": (req, res) => {
    res.send({ code: 0, data: getUsers});
  },
  "GET /site/uc/api/roles": (req, res) => {
    res.send({ code: 0, data: getRoles});
  },
  "POST /site/uc/api/users": (req, res) => {
    addUser(req.body)
    res.send({
      code: 0,
      data: getUsers,
    });
  },
  "POST /site/uc/api/users/:id": (req, res) => {
    updateUserById(req)
    res.send({
      code: 0,
      data: getUsers,
    });
  },
  "POST /site/uc/api/users/:id/delete": (req, res) => {
    //一个“路径参数”使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 this.$route.params，可以在每个组件内使用。
    // const params = parse(req.url, true).query;
    deleteUserById(req.params.id)
    res.send({
      code: 0,
      data: getUsers,
    });
  },
};