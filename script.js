const modal=document.getElementById('modal');
const modalShow=document.getElementById('show-modal');
const modalClose=document.getElementById('close-modal');
const bookmarkForm=document.getElementById('bookmark-form');
const websiteNameEl=document.getElementById('website-name');
const websiteUrlEl=document.getElementById('website-url');
const bookmarksContainer=document.getElementById('bookmarks-container');


let bookmarks=[];
//show modal , focus on input

function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}


//Modal Event Listener
modalShow.addEventListener('click',showModal);
modalClose.addEventListener('click',()=>{
    modal.classList.remove('show-modal');
})
window.addEventListener('click',(e)=>{
   e.target===modal?modal.classList.remove('show-modal'):false;
})


//Validate form using regex

function validate(nameValue,urlvalue){
    const expression=/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex=new RegExp(expression);
    
    if(!nameValue || !urlvalue){
        alert("Both fields are necessary")
        return false;
    }
    if(!urlvalue.match(regex)){
        alert('Provide a valid web adress')
        return false;
    }
    
    return true;
}

//Build Bookmarks DOM
function buildBookmarks(){
    
    bookmarksContainer.textContent='';
    
    //build items
    bookmarks.forEach((bookmark)=>{
       const {name,url}=bookmark;//destructuring from local storage
        
        //item
        const item=document.createElement('div');
        item.classList.add('item');
        //close icon
        const closeIcon=document.createElement('i');
        closeIcon.classList.add('fas','fa-times');
        closeIcon.setAttribute('title','Delete Bookmark');
        closeIcon.setAttribute('onclick',`deleteBookmark('${url}')`);
        //FAVicon / link container
        
        const linkInfo=document.createElement('div');
        linkInfo.classList.add('name');
        //favicon
        const favicon=document.createElement('img');
        favicon.setAttribute('src',`https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt','Favicon');
        const link=document.createElement('a');
        link.setAttribute('href',`${url}`);
        link.setAttribute('target','_blank');
        link.textContent=name;
        //Append to bookmarks container
        
        linkInfo.append(favicon,link);
        item.append(closeIcon,linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

//Fetch bookmarks
function fetchBookmarks(){
    //get bookmarks from localstorage
    if(localStorage.getItem('bookmarks')){
        bookmarks=JSON.parse(localStorage.getItem('bookmarks'));
    }
    else{
        //create a bookmarks array in local storage
        bookmarks=[{
            name:'sanjay goal',
            url:'https://www.sanjaybookstore.herokuapp.com',
        }];
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
        bookmarkForm.reset();
        websiteNameEl.focus();
    }
    buildBookmarks();
}

//delete bookmark
function deleteBookmark(url){
    bookmarks.forEach((bookmark,i)=>{
        if(bookmark.url==url){
            bookmarks.splice(i,1);
        }
    });
    //update the bookmarks array
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
}

//Handle form data
function storeBookmark(e){
    e.preventDefault();
   const nameValue=websiteNameEl.value;
    let urlValue=websiteUrlEl.value;
    if(!urlValue.includes('http://','https://')){
        urlValue=`http://${urlValue}`;
    }
    if(!validate(nameValue,urlValue)){
        return false;
    }
    const bookmark={
        name:nameValue,
        url:urlValue,
        
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    bookmarkForm.reset();
    websiteNameEl.focus();
    fetchBookmarks();
}
bookmarkForm.addEventListener('submit',storeBookmark);

//on Load fetch bookmarks
fetchBookmarks();






