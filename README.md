# Connecting

send ?playerId=#### in the sio connection string. You can use whatever you want!


# Incoming Events

## sync
Will have all player states.
message[playerId1].state 
message[playerId2].state

## online
message.source = player id

## offline
message.source = player id


## update
message.source = source player id
message.state = source player state


## hit
message.source = source player id
message.options = hit options


# Outgoing

## hit
message.target = message target
message.options = hit options

## update
message.state = player state
