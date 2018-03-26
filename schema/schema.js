const graphql = require ('graphql');
const axios = require ('axios');

const {
     GraphQLObjectType,//through this object type we are gonna instruct graphql the presence of a User
     GraphQLString,
     GraphQLInt,
     GraphQLSchema, //takes a root query and returns a graphql instance
     GraphQLList,
     GraphQLNonNull
 } = graphql;

 const CompanyType = new GraphQLObjectType({
     name : 'Company',
     fields : ()=>({
         id : {type: GraphQLString},
         company_name : {type: GraphQLString},
         description : {type : GraphQLString},
         user : {
             type: new GraphQLList(UserType),
             resolve(parentValue,args){
                 return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                 .then(resp=> resp.data)
                 .catch((error)=>{
                     console.log(error);
                 });
             }
         }
     })
 });

const UserType = new GraphQLObjectType({
    name : 'User', //defines the type of Object tht has been made.
    fields : ()=>({
        id : {type : GraphQLString},
        first_name : {type : GraphQLString},
        age : {type : GraphQLInt},
        company: {
            type : CompanyType,
            resolve(parentValue,args){
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                .then(resp=> resp.data)
                .catch((error)=>{
                    console.log(error);
                });
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields : {
        user : {
            type : UserType,
            args : {id: { type: GraphQLString }},
            resolve(parentValue,args){
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(resp => resp.data)
                .catch((error)=>{
                    console.log(error);
                });
            }
        },
        company: {
            type : CompanyType,
            args : {id : {type : GraphQLString}},
            resolve(parentValue,args){
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then(resp => resp.data)
                .catch((error)=>{
                    console.log(error);
                });
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args:{
                first_name : {type: new GraphQLNonNull(GraphQLString)},
                age : {type : new GraphQLNonNull(GraphQLInt)},
                companyId : {type: GraphQLInt}
            },
            resolve(parentValue,{id,first_name,age}){
                return axios.post('http://localhost:3000/users',{first_name,age})
                .then(res=>res.data)
                .catch((error)=>{
                    console.log(error);
                });
            }
        },
        deleteUser : {
                type: UserType,
                args: {
                    id:{type:new GraphQzLNonNull(GraphQLString)}
                },
                resolve(parentValue,{id}){
                    return axios.delete(`http://localhost:3000/users/${id}`)
                    .then(res=>res.data)
                    .catch((error)=>{
                        console.log(error);
                    })
                }
        },
        editUser: {
            type: UserType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)},
                first_name : {type: GraphQLString},
                age : {type : GraphQLInt},
                companyId : {type: GraphQLInt}
            },
            resolve(parentValue,args){
                return axios.patch(`http://localhost:3000/users/${args.id}`,args)
                .then(res=>res.data)
                .catch((error)=>{
                    console.log(error);
                });
            }
        },
    }
})
module.exports = new GraphQLSchema({
    query : RootQuery,
    mutation
});
