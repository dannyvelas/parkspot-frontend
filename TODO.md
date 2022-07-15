## Tech debt
- [x] add env variable for backend URL
- [x] delete \_LoadedCar.svelte
- [x] use Status<T> instead of result in car/[id].svelte
- [x] find a way to make exceptions list shorter (just make the list have the same amt of cols as other lists, use PermitList.svelte)
- [x] don't allow signed-in users to click login/register buttons
- [x] make the parameters to Pagination more similarly named to the parameters to PermitList
- [x] (NOT NECESSARY) make error messages more abstracted and user friendly in login page
- [x] (DEPLOY) make `credentials=true` in fetch options, only work in dev if it's not necessary in prod. (it is necessary in prod)
- [ ] remove `reversed` parameter from anywhere that is not a permit endpoint.
- [ ] (HARD) logout when token expires
- [ ] (NEW JS LIB) find a way to only define list styles once
- [ ] (DEPLOY) test how different the user experience is without client side rendering
## Major Missing From Spec
### Admin
- [x] show actual number of all permits instead of just the amount on the page
- [x] edit and delete permits
- [x] search functionality permits page
- [x] admin create parking permit
- [x] visitors page
- [x] re-print permit
- [x] create user account
- [ ] edit resident parking days
### Resident
- [x] resident create parking permit
- [x] see active and all parking permits
- [x] create visitors
- [x] delete visitor
## Minor Missing From Spec
- [x] nav bar at top of admin page
- [x] style logout button in navbar to be side-by-side with Go Back To Dashboard
- [ ] sort residents by amt parking days
- [ ] edit and delete residents
- [ ] isException column
- [ ] nav bar at bottom of list pages
- [ ] add support for security accounts
- [ ] search residents
- [ ] ability for admin to see all visitors (not just active)
- [ ] ability for admin to search all visitors (not just active)
## Low priority
- [x] right now, every permit page except for the all permits page will only query for the first page of permits, and when a user searches, it will only search that first page of permits. The permits on all other pages never get searched. Change the search on these pages such that if there's only one page, the behavior stays the same. If there's more than one page, have it perform the same type of API search the all permits page uses.
- [x] move dashboard func to lib directory
- [x] fix the cheap way that permit list checks whether its a resident list or admin list (by using `pageToHref.includes`)
- [ ] make counts update when permits are deleted
- [ ] remove /request suffix from page that creates permits
- [ ] use .scraps/permits/\_\_layout.svelte to inject all the boilerplate into src/routes/permits funcs
- [ ] use dashboard func in lib directory instead of using ones that are defined on-the-spot
- [ ] make sure all load funcs redirect to a users dashboard when that user accesses a page for which they do not have the right role.
- [ ] make /permits/\* pages automatically re-route to the resident dashboard if it's a resident that is trying to access them
- [ ] move renderDate and tsToDate funcs to libs since both \_PermitsList and permit/[id] components use them
- [ ] remove `src/routes/residents/\_load.ts` and make it use the `loadList` func instead
- [ ] detach pagination and searching from PermitList and VisitorList
- [ ] probably remove NewPermitReq type definition, it's only used once in one place
- [ ] probably change the way that the choose-dates input bar is toggled visible by using event bubbling
- [ ] probably remove ability for residents to re-print all of their permits
- [ ] make all permits for resident filter in place when searching
- [ ] organize lib directory by separating helper funcs and components
- [ ] clean up to make sure that the order of `// props, // model, // init, // events, // helpers` is consistent
- [ ] add check to redirect signed-in users to the correct dashboard
- [ ] change resident pages from /resident/[id]/permits to me/permits, so that we don't have to worry about resident 123 trying to go to /resident/567/permits
- [ ] don't let people go to ?page=43 where 43 > total amount of pages
- [ ] make page amounts re-fresh when items are deleted from list
- [ ] find some way to get 401 and sign person out before API returns 401
- [ ] add `map` type to Status and Result
- [ ] find some way to copy less logic between index.svelte and login.svelte (also maybe shorten nav.svelte)
- [ ] add banner to parent component of nav when logout error happens
## Probably not going to do
- [ ] A search component? A component that you pass in the list or the api endpoint and it returns a search bar, and for every oninput event on that serach bar, it filters the current list? 
## Won't do
- [✗] make params a `{}` argument or use generated types in index.svelte
    * little value
- [✗] strongly type the Props of every `load` func.
    * little value
