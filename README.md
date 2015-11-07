# Connecting

send ?playerId=#### in the sio connection string. You can use whatever you want!


# Incoming Events

## sync
Will have all player states.
message[playerId1].state 
message[playerId2].state

## online
message is player id

## offline
message is player id


## update
message.id - player id
message.state - player state


## hit
source player id


# Outgoing

## hit
target player id

## update
state
