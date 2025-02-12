{
    'use strict';

    const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optTagsListSelector = '.tags.list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-',
    optAuthorsListSelector = '.authors.list';
    
    const titleClickHandler = function (event) {
        event.preventDefault();
        const clickedElement = this;

        /* [DONE] remove class 'active' from all article links*/
        const activeLinks = document.querySelectorAll('.titles a.active');

        for (let activeLink of activeLinks) {
            activeLink.classList.remove('active');
        }

        /* [DONE] add class 'active' to the clicked link */
        clickedElement.classList.add('active');

        /* [DONE] remove class 'active' from all articles */
        const activeArticles = document.querySelectorAll('.posts article.active');

        for (let activeArticle of activeArticles) {
            activeArticle.classList.remove('active');
        }

        /* [DONE] get 'href' attribute from the clicked link */
        const activeAttribute = clickedElement.getAttribute('href');

        /* [DONE] find the correct article using the selector (value of 'href' attribute) */
        const clickedArticle = document.querySelector(activeAttribute);

        /* [DONE] add class 'active' to the correct article */
        clickedArticle.classList.add('active');

    };

    const generateTitleLinks = function (customSelector = '') {
        /* [DONE] remove contents of titleList*/
        const titleList = document.querySelector(optTitleListSelector);
        titleList.innerHTML = '';

        /* [DONE] find all the articles and save them to variable: articles*/
        const articles = document.querySelectorAll(optArticleSelector + customSelector);

        let html = '';

        for (let article of articles) {
            /* [DONE] get the article id*/
            const articleId = article.getAttribute('id');

            /* [DONE] find the title element*/
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;

            /* [DONE] create HTML of the link*/
            const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

            /* [DONE] insert link into titleList*/
            html = html + linkHTML;
        }
        titleList.innerHTML = html;

        const links = document.querySelectorAll('.titles a');

        for (let link of links) {
            link.addEventListener('click', titleClickHandler);
        }
    };

    generateTitleLinks();

    const calculateTagsParams = function (tags){
        const params = {
            max: 0,
            min: 999999,
        }

        for(let tag in tags){
            // console.log(tag + ' is used ' + tags[tag] + ' times');
            params.max = Math.max(tags[tag], params.max);
            params.min = Math.min(tags[tag], params.min);
        }

        return params;
    }

    const generateTags = function () {
        /* [NEW] create a new variable allTags with an empty object */
        let allTags ={};

        /* [DONE] find all articles */
        const articles = document.querySelectorAll(optArticleSelector);

        /* [DONE] START LOOP: for every article: */
        for (let article of articles) {

        /* [DONE] find tags wrapper */
            const tagsList = article.querySelector(optArticleTagsSelector);

            /* [DONE] make html variable with empty string */
            let html = '';

            /* [DONE] get tags from data-tags attribute */
            const articleTags = article.getAttribute('data-tags');

            /* [DONE] split tags into array */
            const articleTagsArray = articleTags.split(' ');

            /* [DONE] START LOOP: for each tag */
            for(let tag of articleTagsArray) {
                /* [DONE] generate HTML of the link */
                const tagHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li> ';

                /* [DONE] add generated code to html variable */
                html = html + tagHTML;

                /* [NEW] check if this link is NOT already in allTags */
                if(!allTags[tag]){
                    /* [NEW] add tag to allTags object */
                    allTags[tag] = 1;
                } else {
                    allTags[tag]++;
                }
            /* [DONE] END LOOP: for each tag */
            }
            /* [DONE] insert HTML of all the links into the tags wrapper */
            tagsList.innerHTML = html;

        /* [DONE] END LOOP: for every article: */
        }

        /* [NEW] find list of tags in right column */
        const tagList = document.querySelector(optTagsListSelector);

        /* [NEW] create variable for all links HTML code */
        const tagsParams = calculateTagsParams(allTags);
        console.log('tagsParams: ', tagsParams);
        let allTagsHTML = '';

        /* [NEW] START LOOP: for each tag in allTags: */
        for(let tag in allTags){
            /* [NEW] generate code of a link and add it to allTagsHTML */
            // allTagsHTML += tag + ' (' + allTags[tag] + ') ';
            allTagsHTML += '<li><a href="#tag-' + tag + '">' + tag + ' (' + allTags[tag] + ')</a></li>';
        }
        /* [NEW] END LOOP: for each tag in allTags: */

        /*[NEW] add HTML from allTagsHTML to tagList */
        tagList.innerHTML = allTagsHTML;
    };

    generateTags();

    const tagClickHandler = function (event) {
        /* [DONE] prevent default action for this event */
        event.preventDefault();

        /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
        const clickedElement = this;

        /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
        const href = clickedElement.getAttribute('href');

        /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
        const tag = href.replace('#tag-','');

        /* [DONE] find all tag links with class active */
        const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

        /* [DONE] START LOOP: for each active tag link */
        for (let activeTag of activeTags){
            /* [DONE] remove class active */
            activeTag.classList.remove('active');
        }
        /* [DONE] END LOOP: for each active tag link */

        /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
        const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

        /* [DONE] START LOOP: for each found tag link */
        for (let tagLink of tagLinks){
            /* [DONE] add class active */
            tagLink.classList.add('active');
        }
        /* [DONE] END LOOP: for each found tag link */

        /* [DONE] execute function "generateTitleLinks" with article selector as argument */
        generateTitleLinks('[data-tags~="' + tag + '"]');
    };

    const addClickListenersToTags = function(){
        /* [DONE] find all links to tags */
        const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

        /* [DONE] START LOOP: for each link */
        for(let link of tagLinks){
            /* [DONE] add tagClickHandler as event listener for that link */
            link.addEventListener('click', tagClickHandler);
        }
        /* [DONE] END LOOP: for each link */
    };

    addClickListenersToTags();

    const generateAuthors = function () {

        const articles = document.querySelectorAll(optArticleSelector);

        for(let article of articles){
            const authorWrapper = article.querySelector(optArticleAuthorSelector);
            const articleAuthor = article.getAttribute('data-author');
            const authorHTML = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';

            authorWrapper.innerHTML = authorHTML;
        }
    };

    const authorClickHandler = function (event) {
        event.preventDefault();

        const clickedElement = this;
        const href = clickedElement.getAttribute('href');
        const author = href.replace('#author-','');

        const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');

        for(let activeAuthor of activeAuthors){
            activeAuthor.classList.remove('active');
        }

        const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

        for(let authorLink of authorLinks){
            authorLink.classList.add('active');
        }

        generateTitleLinks('[data-author="' + author + '"]');
    };

    const addClickListenersToAuthors = function () {
        const authorLinks = document.querySelectorAll('a[href^="#author-"]');

        for(let link of authorLinks){
            link.addEventListener('click', authorClickHandler);
        }
    };

    generateAuthors();
    addClickListenersToAuthors();
}