# Adventure

These commands enable playing a text-based adventure campaign via a chat bot. The players (any member of the group chat) will all be in the same "room" together at all times (no splitting the party!). From there they will be able to issue commands (generally "verbs") to the chat bot service to advance the story.

## Key player concepts

These concepts describe how the players will interact with the chat bot and game world.

**selecting a campaign**

These commands can only be used while not current playing a campaign.

```
#adv                 - list all available campaigns
#adv [campaign name] - begin the named campaing
```

**describing the world**

Every time the players enter a new Room, a prompt will be displayed. From there, players can use any of the basic commands to interact with the game world.

**inventory**

A list of items or states that the players current have.

**daily prompts**

Dunno if this is a good idea, but at the very least, every day the chat bot could prompt the same room description again to provoke interest in completeing the dungeon.

**basic commands**

Some basic commands that will be globally available:

```
#get  [item name]                  - pick up an item/object in the room
#talk [npc name]                   - start a conversation with an npc
#say  [thing to say | convo index] - say something out loud or respond to an npc
#go   [direction | room name]      - go to room by name
#use  [item name]                  - use an item in the current room or in you inventory
#look [no option | name]           - inspect the room or interactable by name
#prompt                            - display the room description again.
#quit                              - stop playing the campaign
#help                              - show list of commands
```

## Storyteller concepts

These come in to play when crafting the story and world the players will interact with (perhaps via an admin interface?).

**a game of rooms**

The game world will be described as a set of "rooms" in 3d space. A room isn't necessarily a room in a house, but any sort of area you wish the players to interact in; a clearing in the woods, the living room of a house, or a culdasac are all examples of "rooms".

Each room has similar characteristics: A name, description, points of interest, and exits.

**describing interactables in a room**

TODO

**interactable requirements**

TODO

**creating items and states**

TODO

**NPCs**

TODO

**the end of the game**

Once the players reach the last "room", create a special "exit" that will display the end success text. Players win!

## Tech

This will require persistence. We'll use google firestore to handle saving campaigns as well as current state of the players throughout the campaign.

Rooms will be stored as a graph, with each room containing pointers to the next room. This is the same as a `Conversation`, which has a prompt and answers, but each answer can point to another conversation.

## Campaign Creation

Because we don't want just anyone to manage the database, we'll have to create a user and only authenticated users can create, read, update, delete campaigns.

This will be handled by adding a new UI route: `/campaign` that will have a small and simple editor that will help create items, rooms, npcs, conversations, etc, and help to associate them together.

## Database types

These are what bind the game world together. Each campaign will be a document in the database named `campaigns`. All items, npcs, rooms, conversations, answers, etc, will be added as _subcollections_ inside that specific campaign document.

There is a risk that fragmenting and the use of "foreign keys" (even though firebase doesn't have that concept) will be hard to administrate. It essentially means that a user will have to use a UI to do any sort of campaign maintenance.

```typescript
// And Id will always be a string, but making it a
// special type will help make a distinction between
// a string, a type, or an actual Id.
// These should all be unique, but not necessarily in any
// particular format.
type ID = string;

// literally anything in the game world.
// everything must have an ID, name, and description.
// the basic idea is that everything is serializable to
// a string and therefore can easily be stored in a database,
// thus making saving, restarting, and testing easier.
type WorldObject = {
  id: ID;
  name: string;
  desc: string;
};

// transitionin signals the beginning of the campaign.
type Campaign = WorldObject & {
  type: 'campaign';
  first_room: ID; // the id of the first room in the campaign.
  exposition: string; // text to be read when the players start the campaign.
};

type Item = WorldObject & {
  type: 'item';
  inspect_desc: string; // text when looking close
  interactable_desc: string; // text to be displayed when this item is used.
  is_usable: boolean; // is this a state token or can the players use it?
};

type Room = WorldObject & {
  type: 'room' | 'end_room'; // the 'end_room' is where the players will finish the  game!
  inspect_desc: string; // text for when players inspect the room further
  items: ID[]; // items to be picked up or interacted with in the room.
  requires_item?: ID; // require an item to be able to get to this room
  requires_item_usage?: ID; // requires an item to be used before this room is available
  next_rooms: ID[]; // the next areas to get to.
  prev_room: ID; // a referece to the previous room to go back.
};

type Player = WorldObject & {
  type: 'player';
  score: number; // for the current campaign.
  inventory: ID[];
};

type NPC = WorldObject & {
  type: 'npc';
  conversation_id: ID; // the id of the conversation to start
};

type Conversation = WorldObject & {
  type: 'conversation';
  prompt: string;
  answers: ID[];
};

type Answer = WorldObject & {
  type: 'answer';
  next_conversation?: ID; // the next conversation node after this response has been sent.
  requires_item?: ID; // the item/state ID that the player needs to contain to select this answer
  gives_item?: ID; // the item/state ID that the player obtains after picking this answer
};
```
