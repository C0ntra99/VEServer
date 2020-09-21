# VibeEngine Server
## Description
The VibeEngine server is what is used to manage scoring of the clients. Clients connect to the server and the server will put clients into a round or score them individually.  

The server is designed in such a way that the client and the server can be run parallel on the same system OR the server can on a separate system.

## Workflow
- Instance(client) registers with server (*see REST API section*)
    - The Instance will report the engine configuration and team configuration, and other metadata of the instance
    - Instances can be created without a team 
    - Instances MUST run within a round
      - to be changed
- Once the instance is registered and a round is started the server will periodically send `GET` requests to the clients to get an update of the score
  - This is configured in the engine(*WIP*)
- Instances response with the score will get updated in the MongoDB  
- Round scores will get displayed with data from the MongoDB or accessed directly via the REST API.


