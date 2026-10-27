So. How this project can be helpful for me personally?
The thing is if I won’t find it helpful - there’s no need to do it.
But crucial thing is that it must be helpful uniquely

So. Dream analysis. How about that?

- System prompt
- Conversation

Branching would be helpful.
Tasks organized as well
Readable text with colorful headers
Ability to either type in or dictate my text from the phone and for it to be saved as input.
So I bypass the need to type into obsidian.

---

Dev. For now, it’s only about developing the app. So it’ll make easier to develop it further.

Do I have ideas for further development? Well, if the app won’t blow up - I may be forced to do maybe some todolist app or something. Some service maybe. But that’s not likely for now, current app has potential if it’ll be done properly, and if you can’t do it properly - then it won’t matter if you’ll do another product not properly

---

But how it’s different from other apps?

Well, it’s all in one package. It allows deletion of context. Branching. Multiple users. It’s helpful.

---

## How it can help me to get going in life?

Especially in comparison with open web ui, which has branching as well.

---

That’s the problem. I don’t know how it can be helpful. Claude will have 90% of what I have, but I will have 50% of what claude has, no reason to seek the app.

---

Ok. So make reasons.

Because of context management it would be cheaper. But the same can be done on opencode, if not the same, then most of it.

So how your app would be different?

Branching and that’s it? User edits? Feels weak.
Then why don’t I use Codex? Well, that’s why, because it’s replacement. As well as cursor or something. I don’t want replacement.

---

Ok, let’s start from the first step. How to make it worthwhile?
That’s the thing - you can’t. All you can do is tightly integrate functionality inside the app.
For example - to study things.

Anki, exams.To have quick and comfortable flow to remember, analyse.

Meta-chats. With dreams, for example, so you can start a task and ask model to find pattern in the last 30-50 tasks through subtasks.

Dev - user edits and proper tools are big one.

What else? Integrated reminders? Ability to draw on pictures? Ability to branch the chat to work on mermaid diagrams? So you can do a bunch of specific things that may work.

---

Ok, now I see that. Yes, it may work. How to approach this app in a manner that I can do right now?

Familirization and figuring out tasks, phases. To recreate new structure.
After that revaluate some things.

- Do you need permissions/users?
- Do you need event-driven sync? Do you even need server-side request, and maybe it’ll be worth it to send them from the client, and save to server only for multi-device persistency?
- Do you need custom logic for providers instead that “Vertex or what”library that handle all of them automatically?

---

Ok. I figured out how basic familiarization. Now I must start refactor, or should I?
I have 2 options
Go to refactor
Go to client2

What refactor will give me?

- Better understanding of the code.
- Less uncertainity
  What client2 will give me?
- Progress, movement.
- Like right now the backend works good enough to be considered stable. When I’ll bring client2 up to the speed - I’ll be able to delete whole client package. Which will reduce complexity of the cod

So yeah, it seems like I need client2 first. I can’t afford another week in that refactor

---

So what should be included in that client2 phase?

1. Workspace layout
2. Tasks list layout
3. Task layout
4. Minimap
5. Editor
6. Chat box with messages
7. Scroll features
8. Tool visualization
9. Design

So let’s imagine that’s a week worth of work. Worth it? Yeah.Then you can deprecate client2. And use better more fancy interface.

---

Workspace layout. Noooo
App layout. I want sidebar for the app,
Do I need it though? No.
Now you can do only workspace layout, then navigation back/forward.
Do I need navigation? Not really. Only to get out from the task.

---

Ok. Workspace layout. 2d array of projects. Grouping will be done later as extra feature.
==task bookmarks on sidebar/workspace instead of browser bookmarks==

---

Ok, so what sohuld be on layout? List of projects as buttons with some minor info? Else?

man it got boring.

---

Problem, again. I don’t really believe that this app will work for me, or be useful for that matter. I can’t even do workspace layout. Is because of puer, or is there something else I’m missing?

Bigger picture for example. Like it’ll help me learn, but then it isn’t that hard to do it with claude or codex. It may save some money? Open code.
Cursor for development. So it’s like not unique. What is unique? Branches? Meh. So then what’s the point. Like at the same time I can do my game instead. Would be the same work.

But then you’ll be hopeless in the game. as well. Ok, then what? if it doesn’t work anyway. How to make it worthwhile? I don’t know.

There’s just too little of unique stuff, and too much of stuff that is not unique.

---

Ok, that’s puer speaking. Or mother complex. It’s not real. So hat to do if it’s not real? Focus on workspaces.

But that’s the damn thing. Why? Why I must work hard on something that doesn’t have any chance? Like it’s so complex - but the game isn’t? So yeah.

---

---

---

---

---

---

What structure I need for the project?

flexlayout - main thing that is its own thing related to the main workspace after we logged in.

auth as well

now task/project/workspace/settings?
like where editor goes, if it’ll be used in settings and task views? Editor goes as the separate feature.

Ok, for now we can do that only for task.

so it’ll be task/minimap task/editor.
That way I’ll hide those features under where they’re relative.

But now what about the tasks list? Like is it big enough to be first-class thing? Like it’s a simple list, groups + sidebar representation. Stats.

Workspace? same, drag and drop, groups, projects, creation, etc.

dock?
notifications, flexlayout, session, auth maybe?

Makes sense? Yeah it does.

---

Does it make sense to have this representation under main dock/ folder?
For sure no. Or well.

like dock/features, then task, project and workspace in there.
then like dock/features/task/features/editor

nah, stupid.

then how to approach this?

we have app/ we have features/ we have core/ we have state/

we can’t insert flexlayout into the app, because of auth which acts as isolated view before flexlayout goes in. And also, because of that we can extract the dock, because it’ll be stupid that the auth will be like second-class and dock as first class.

So what to do?

Look, will you truly have 50 features worth to be first-class?

So you probably do domains/ instead.
auth, dock, workspace/project/task. You don’t need more.
Then you’ll
