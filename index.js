const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//user credintial
// user name: task_user
// password : JM1Xa2tf9dNFSn6J

const uri =
  "mongodb+srv://task_user:JM1Xa2tf9dNFSn6J@cluster0.kdwgcoc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    //code goes here
    const taskCollection = client.db("taskManager").collection("task");

    //create operation
    app.post("/task", async (req, res) => {
      const taskData = req.body;
      console.log(taskData);
      const result = await taskCollection.insertOne(taskData);
      res.send(result);
    });
    // const user = { name: "nahiya nahi", email: "nahiya@gmail.com" };
    // const result = await taskCollection.insertOne(user);
    // console.log(result);

    //read operation
    app.get("/task", async (req, res) => {
      const query = {}; //joto object ache sob gulo select kore
      const cursor = await taskCollection.find(query); //like of pointer to get all users
      const users = await cursor.toArray(); //cursor ta ke array te convert kore dibe
      res.send(users);
    });

    //update completed operation
    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          completed: true,
        },
      };
      const result = await taskCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    //get completed task list
    app.get("/completed", async (req, res) => {
      const query = { completed: true, email: req.query.email };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });

    //delete operation
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);

      //   const query = { _id: ObjectId(id) };
      //   const result = await taskCollection.findOne(query);

      console.log(result);
      res.send(result);
    });

    app.get("/tasks", async (req, res) => {
      const query = {};
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });

    //update task message
    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      console.log(req.body);
      const message = req.body.newTask;
      console.log(req.body);
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          taskMessage: message,
        },
      };
      const result = await taskCollection.updateOne(query, updateDoc, options);
      res.send(result);
      console.log(result);
    });
    //get task list by email
    app.get("/mytasks", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const result = await taskCollection.find(query).toArray();
      res.send(result);
      console.log(result);
    });
  } catch {
    (err) => {
      console.error(err);
    };
  } finally {
    //code goes here
  }
}
run().catch((err) => {
  console.error(err);
});

app.get("/", (req, res) => {
  res.send("task manager server is running successfully");
});

app.listen(port, () => {
  console.log(`the task manager server is running on port number : ${port}`);
});
