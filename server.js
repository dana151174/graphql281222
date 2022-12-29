const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const axios = require('axios');
const app = express();
let obj=null;
/*https://stackoverflow.com/questions/33709807/how-to-connect-to-sql-server-with-windows-authentication-from-node-js-using-mssq*/
var sql = require('mssql/msnodesqlv8');
var config = {
  connectionString:
    'Driver=SQL Server;Server=DESKTOP-9KKSAP5\\SQLEXPRESS;Database=graphql;Trusted_Connection=true;',
};
sql.connect(config, err => {
  new sql.Request().query('SELECT * from users', (err, result) => {
    console.log('.:The Good Place:.');
    if (err) {
      // SQL error, but connection OK.
      console.log('  Shirtballs: ' + err);
    } else {
      // All is rosey in your garden.
      console.dir(result);
      obj=result.recordset;
    }
  });
});
sql.on('error', err => {
  // Connection borked.
  console.log('.:The Bad Place:.');
  console.log('  Fork: ' + err);
});

let message = 'this is a message';
const schema = buildSchema(`

type Post{
  userId: Int
  id: Int
  title: String
  body: String
  description: String
  price: Int
  rating: String
}

type User{
  name: String
  age: Int
  college: String
}

type Query{
  hello: String
  welcomeMessage(name: String, dayOfWeek: String!): String
  getUser: User
  getUsers: [User]
  getPostsFromExternalAPI: [Post]
  message: String
  getStudents: [User]
}

input UserInput{
  name: String!
  age: Int!
  college:String!
}

type Mutation{
  setMessage(newMessage : String): String
  createUser(user:UserInput): User
}
`);

const root = {
  hello: () => {
    return 'Hello world!';
  },

  welcomeMessage: args => {
    console.log(args);
    return `Hey ${args.name}, hows life? today is ${args.dayOfWeek}`;
  },

  getUser: () => {
    const user = {
      name: 'dana shotland',
      age: 26,
      college: 'Haifa',
    };
    return user;
  },

  getUsers: () => {
    const users = [
      {
        name: 'denis',
        age: 19,
        college: 'braude',
      },
      {
        name: 'dana',
        age: 18,
        college: 'Haifa',
      },
      {
        name: 'artium',
        age: 29,
        college: 'emek',
      },
    ];
    return users;
  },

  getPostsFromExternalAPI: async () => {
    return axios
      .get('https://dummyjson.com/products/')
      .then(result => result.data.products);
  },

  getStudents:()=>{
    return obj;
  },

  setMessage: ({ newMessage }) => {
    message = newMessage;
    return message;
  },

  message: () => message,
  createUser: args => {
    console.log(args);
    return args.user;
  },
};

app.use(
  '/graphql',
  graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: root,
  })
);

app.listen(4000, () => console.log('Server on port 4000'));
