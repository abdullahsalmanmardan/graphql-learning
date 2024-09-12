query GetAllTodos {
  getTodos {
    title
  }
  getAllUsers {
    email
    name
  }
}

- to get single data
query GetAllTodos($getUserId: ID!) {
  getUser(id: $getUserId){
    name
    email
  }
}
