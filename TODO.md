## Tech debt
- [x] add env variable for backend URL
- [x] delete \_LoadedCar.svelte
- [x] use Status<T> instead of result in car/[id].svelte
- [ ] make error messages more abstracted and user friendly in login page
- [ ] find a way to only define list styles once
- [ ] find a way to make expired.svelte shorter
- [ ] don't allow signed-in users to click login/register buttons
- [ ] make the parameters to Pagination more similarly named to the parameters to PermitList
- [ ] make `credentials=true` in fetch options, only work in dev if it's not necessary in prod
## Major Missing From Spec
- [x] show actual number of all permits instead of just the amount on the page
- [x] edit and delete
- [x] not signing out on re-fresh
- [ ] create user account
- [ ] search functionality
- [ ] admin create parking permit
- [ ] resident page
    - [ ] resident create parking permit
    - [ ] see active and all parking permits
## Minor Missing From Spec
- [x] nav bar at top of admin page
- [x] style logout button in navbar to be side-by-side with Go Back To Dashboard
- [ ] fix page error in all permits page
- [ ] nav bar at bottom of list pages
## Maybe
- [ ] remove getLoadFn definition
## Low priority
- [ ] add `map` type to Status and Result
- [ ] add banner to parent component of nav when logout error happens
- [ ] don't let people go to ?page=43 where 43 > total amount of pages
- [ ] make page amounts re-fresh when items are deleted from list
- [ ] find some way to get 401 and sign person out before API returns 401
## Won't do
- [✗] make params a `{}` argument or use generated types in index.svelte
    * little value
- [✗] strongly type the Props of every `load` func.
    * little value
