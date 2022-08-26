"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`)
  let shows = []
  for (let item of res.data){
    let {id, name, summary} = item.show;
    let pic = item.show.image.medium;
    id = id===null?"":id;
    name = name===null?"":name;
    summary = summary===null?"":summary;
    pic = pic===null?"https://tinyurl.com/tv-missing":pic;
    shows.push({
      id: id,
      name: name,
      summary: summary,
      image: pic
    });
  }

  return shows
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src='${show.image}'
              alt="Bletchly Circle San Francisco" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
  $('#shows-list button').on('click',async function(e){
    e.preventDefault();
    const id = $(this).parent().parent().parent()[0].dataset.showId
    let episodes = await getEpisodesOfShow(id)
    populateEpisodes(episodes);
  })
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  return res.data;
 }

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
  $('#episodes-list').empty();
  for(let ep of episodes){
    console.log(ep)
    const $show = $(`<li>${ep.name} (Season ${ep.season}, Episode ${ep.number})</li>`)
    $('#episodes-list').append($show)
  }

  $episodesArea.show();
  //$episodesArea.remove();

}
