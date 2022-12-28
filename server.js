const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const axios = require('axios');
const app = express();

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
