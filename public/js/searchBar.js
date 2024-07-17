function searchListing(){
    var query = document.getElementById('search-inp').value.toLowerCase().toUpperCase();
    console.log(query);
    const allListings = document.querySelectorAll(".listingCard");
    
    allListings.forEach(function(listing) {
        const title = listing.querySelector('.card-text').textContent.toUpperCase();
        console.log(title);
        if(title.includes(query)){
            listing.style.display = "";
        }
        else{
            listing.style.display = "none";
        }
    });
}