const graphql = require ('graphql');
const _ = require('lodash');

const {
     GraphQLObjectType,//through this object type we are gonna instruct graphql the presence of a User
     GraphQLString,
     GraphQLInt,
     GraphQLSchema //takes a root query and returns a graphql instance
 } = graphql;

const users =[
    {id: 23 , first_name : 'Bill' , age : 20},
    {id: 45 , first_name : 'Samantha' , age: 21}
];
const UserType = new GraphQLObjectType({
    name : 'User', //defines the type of Object tht has been made.
    fields : {
        id : {type : GraphQLString},
        first_name : {type : GraphQLString},
        age : {type : GraphQLInt}
    }
});

const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields : {
        users : {
            type : UserType,
            args : {id: { type: GraphQLString }},
            resolve(parentValue,args){
                return _.find(users, {id:args.id});
            }
        }
    }
})
module.exports = new GraphQLSchema({
    query : RootQuery
});
