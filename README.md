# serverside-scoreboard
A simple arcade style scoreboard.

## Summary

The idea here is to build a simple server-side scoreboard mechanism that can be used by clients to share and compare scores.

Here's an example of how the data may be displayed by a client:


```
Rank   Initials   Level   Score  

          TOP SCORES  

 1       HAY       49     62,750
 2       ACK       45     57,200
 3       ACK       45     56,000
 4       TTT       42     47,800
 5       JNJ       42     47,700
 6       TIM       40     45,000
 7       JAK       38     40,500
 8       JAK       37     38,800
 9       SQL       35     33,000
 10      POD       32     26,500

          YOUR SCORE  

 85      KID       10      6,000
```


## Actions

1. Get scores, sorted in ascending order, paged by 25
1. Add new score
1. Get rank # for specified score

## Implementation

Flexible.  

It would be great to have REST endpoints that supported the **Actions** listed above.

## Installation and Deployment

    $ npm install
    $ sudo npm install -g nodemon
    $ nodemon npm start

## Proposal Installation

1. ~/.bash_profile needs   
    export SCOREBOARD_DSN="mysql://scoreboard:scoreboard@localhost/scoreboard"
2. Perform in project directory:  
    npm install
    npm install -g nodemon #may require sudo
3. Perform in project directory:  
    nodemon npm start #application will automatically restart after code changes.
    
