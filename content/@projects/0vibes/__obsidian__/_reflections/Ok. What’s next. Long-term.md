Let’s list stuff we need to do for sure

1. Settings
   1. Settings server as SSOT of configuration
   2. Settings client-side
2. Providers
   1. Add openAI sub
   2. After - rethink/rewrite/refactor providers
3. Extension
   1. view (auth through pat?) or maybe like try to imitate cookies or something?
      1. Google how do sessions in VSCode’s view.
4. Worker
   1. TLS/mTLS for worker
   2. Worker path join
5. Client2
   1. Continue legacy rewrite.
      1. Tasks view/Task view
   2. Write and lock in beautiful auth page?
      1. First impressions matter?
   3. Projects page also needs proper design

---

Let’s think on meta level

Why you need order? To reduce rewrites and increase efficiency.
To start adding visual changes so you can see progress that will motivate you.

---

Ok. Let’s imagine today you did UI. What’s next? Settings.

---

UI then?

Look. Beautiful auth page - nice place to start experimenting. So find templates/styles/designs/etc. To find yourself.

One thing is that damn animations.

Ok. So.

---

You first do auth page.
Then you do workspace page.
Then tasks list.

So you will come down through this?

OR

You do basic everything and focus on task.
Nah.

---

Ok. We do auth + workspace + project views.

---

Let’s think about auth page.

1. Email or username?
   1. Question is basically if we should support auth through your website. And I would say no.
   2. But then question is for companies.   
   3. But then ability to manage everything locally is so good…
   4. Ok. You must go full-in on this approach.
      1. On website you’ll do key distribution.
   5. ==That’s big one - server-side authoritative popup on free plans== So like adblocker or stuff like that - can hide it, but state will still be frozen until server allows it. Fix would be to rewrite/rebuild server-side
2. Validate password
   1. to not have spaces/new lines.
   2. 8+ letters of a-zA-Z0-9 and symbols.
3. We change to username instead of email
4. For signup - first name + last name
5. Hide big signup button. and add like “don’t have account?”
6. Check demos of beautiful signups
   1. But be mindful that design must be consistent
7. Error system.
   1. Notifications. Either now and wire it up globally for the whole app.
   2. Or auth will have it’s own minimal version.
      1. Not consistent
   3. Notifications are per user.
      1. So auth should have it’s own error/warning popups
8. Maybe some animation for log-in?
   1. Maybe like on pressing the button auth window will move up. And workspace window will move up but from the bottom.
      1. I like idea of pressing log in and that window/modal/form go up like metaphore of sending log in request.
   2. Or maybe some faiding.

---

Now let’s think workspaces window.

1. It’s workspace home view. So it’s more like home page. what we should have on home page?
   1. Account menu.
      1. Create PAT
      2. Sign out
   2. List of projects
   3. Button for future notification history?
2. What should list of projects look like?
   1. Compact vs big.
   2. List vs grid.
      1. List seems better. For searching/pinning
      2. But maybe we should do it in kanban-like style, since app is for-all we should be able to group projects by domain (like dev projects in one column, anki/obsidian/learning - second column, temp projects in third column)
      3. Get inspired by popular kanban-style apps
   3. Sorting?
   4. Search by name?
   5. Pin
3. How project item in that list should look like?
   1. IDE connection status
   2. Worker connection status
   3. Project name
   4. Project path
   5. Project color hint/nuance
      1. Like additional thing to categorize projects.
      2. Optional though.
   6. Project edit button.
4. Project creation logic -
   1. you must be able to dynamically add/remove/change worker.
   2. you must be able to create project without worker
   3. There was some logic that client called localhost to identify if it’s on the same machine as server.
      1. Maybe we do something like that for worker?
      2. Like we have string input for worker id name.
      3. But in parallel from that modal, we’ll also ping localhost for worker port. But that’s the thing - how would you know worker port?
      4. Like you know server port because url of client has it.
         1. So then maybe server should give each client list of workers - but that’s dangerous.
         2. Maybe then we register worker with users. And either list workers that user already registered (online and offline)
         3. With ability to have multiple workers on user.
            1. Again dangerous. Because we need to store pats somewhere private. If 2 users will have 2 pats on the same machine - it’s a bit dangerous. Because user can leak pat of another user.
            2. So we either need some private storage OR another method of auth for non-browser stuff.
               1. There was that credentials system though. That is like present in each OS. And there was cross-platform package to access it.
         4. Maybe we go even further. Create another modal near Create PAT. Like “Workers”
         5. And do like direct registration
         6. Then in projects we’ll list only workers that were registered for user.
         7.
      5. ==It brings idea of worker rewrite==
         1. like where I wanted to have server be able to execute stuff if it’s on the same machine.

---

Big question though.
Should you do everything? Or defer something?

I would do properly. You know why? Because:

1. Motivation. Finally you do stuff that is not temporary
2. You set complexity on code. Like when you do properly stuff like this - you touch ws handlers, db schema, and many-many other things like this one. So you’ll have better understanding from what is required. And can do pre-emptive code changes for other stuff.
3.
