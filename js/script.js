{
    'use strict';

    const templates = {
        articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
        tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
        authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
        tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
        authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML),
    };

    const opts = {
        articleSelector: '.post',
        titleSelector: '.post-title',
        titleListSelector: '.titles',
        articleTagsSelector: '.post-tags .list',
        articleAuthorSelector: '.post-author',
        tagsListSelector: '.tags.list',
        cloudClassCount: 5,
        cloudClassPrefix: 'tag-size-',
        authorsListSelector: '.authors.list'
    }
    
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
        const titleList = document.querySelector(opts.titleListSelector);
        titleList.innerHTML = '';

        /* [DONE] find all the articles and save them to variable: articles*/
        const articles = document.querySelectorAll(opts.articleSelector + customSelector);

        let html = '';

        for (let article of articles) {
            /* [DONE] get the article id*/
            const articleId = article.getAttribute('id');

            /* [DONE] find the title element*/
            const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

            /* [DONE] create HTML of the link*/
            // const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
            const linkHTMLData = {id: articleId, title: articleTitle};
            const linkHTML = templates.articleLink(linkHTMLData);

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

    const calculateTagClass = function (count, params){
        const normalizedCount = count - params.min;
        const normalizedMax = params.max - params.min;
        const percentage = normalizedCount / normalizedMax;
        const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) +1);

        return opts.cloudClassPrefix + classNumber;
    }

    const generateTags = function () {
        /* [DONE] [NEW] create a new variable allTags with an empty object */
        let allTags ={};

        /* [DONE] find all articles */
        const articles = document.querySelectorAll(opts.articleSelector);

        /* [DONE] START LOOP: for every article: */
        for (let article of articles) {

        /* [DONE] find tags wrapper */
            const tagsList = article.querySelector(opts.articleTagsSelector);

            /* [DONE] make html variable with empty string */
            let html = '';

            /* [DONE] get tags from data-tags attribute */
            const articleTags = article.getAttribute('data-tags');

            /* [DONE] split tags into array */
            const articleTagsArray = articleTags.split(' ');

            /* [DONE] START LOOP: for each tag */
            for(let tag of articleTagsArray) {
                /* [DONE] generate HTML of the link */
                // const tagHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li> ';
                const tagHTMLData = {id: tag, title: tag};
                const tagHTML = templates.tagLink(tagHTMLData);

                // console.log('tagHTMLData: ', tagHTMLData);
                // console.log('tagHTMl: ', tagHTML);

                /* [DONE] add generated code to html variable */
                html = html + tagHTML;

                /* [DONE] [NEW] check if this link is NOT already in allTags */
                if(!allTags[tag]){
                    /* [DONE] [NEW] add tag to allTags object */
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

        /* [DONE] [NEW] find list of tags in right column */
        const tagList = document.querySelector(opts.tagsListSelector);

        /* [DONE] [NEW] create variable for all links HTML code */
        const tagsParams = calculateTagsParams(allTags);
        // let allTagsHTML = '';
        const allTagsData ={tags: []};

        /* [DONE] [NEW] START LOOP: for each tag in allTags: */
        for(let tag in allTags){
            /* [DONE] [NEW] generate code of a link and add it to allTagsHTML */
            // const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a></li> ';

            // allTagsHTML += tagLinkHTML;
            allTagsData.tags.push({
                tag: tag,
                count: allTags[tag],
                className: calculateTagClass(allTags[tag], tagsParams)
            });
        }
        /* [DONE] [NEW] END LOOP: for each tag in allTags: */

        /*[DONE] [NEW] add HTML from allTagsHTML to tagList */
        // tagList.innerHTML = allTagsHTML;
        tagList.innerHTML = templates.tagCloudLink(allTagsData);
        // console.log('allTagsData: ', allTagsData);

        //[DONE] add class=list-horizontal to tags-list in right block
        tagList.classList.add('list-horizontal');
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
        let allAuthors = {};

        const articles = document.querySelectorAll(opts.articleSelector);

        for(let article of articles){
            const authorWrapper = article.querySelector(opts.articleAuthorSelector);
            const articleAuthor = article.getAttribute('data-author');
            // const authorHTML = '<li><a href="#author-' + articleAuthor + '">' + articleAuthor + '</a></li>';
            const authorHTMLData = {id: articleAuthor, title: articleAuthor};
            const authorHTML = templates.authorLink(authorHTMLData);

            authorWrapper.innerHTML = authorHTML;

            //Article number for each author
            if(!allAuthors[articleAuthor]){
                allAuthors[articleAuthor] = 1;
            } else {
                allAuthors[articleAuthor]++;
            }
        }

        //list of authors in right column
        const authorList = document.querySelector(opts.authorsListSelector);
        // let allAuthorsHTML = '';
        const allAuthorsData ={authors: []};
        
        for(let author in allAuthors){
            // const authorLinkHTML = '<li><a href="#author-' + author + '">' + author + ' (' + allAuthors[author] + ')</a></li>';
            // allAuthorsHTML += authorLinkHTML;

            allAuthorsData.authors.push({
                id: author,
                title: author,
                count: allAuthors[author],
            });
        }

        // authorList.innerHTML = allAuthorsHTML;
        authorList.innerHTML = templates.authorListLink(allAuthorsData);

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