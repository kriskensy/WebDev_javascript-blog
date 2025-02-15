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
    };
    
    const titleClickHandler = function (event) {
        event.preventDefault();
        const clickedElement = this;

        /*remove class 'active' from all article links*/
        const activeLinks = document.querySelectorAll('.titles a.active');

        for (let activeLink of activeLinks) {
            activeLink.classList.remove('active');
        }

        /*add class 'active' to the clicked link */
        clickedElement.classList.add('active');

        /*remove class 'active' from all articles */
        const activeArticles = document.querySelectorAll('.posts article.active');

        for (let activeArticle of activeArticles) {
            activeArticle.classList.remove('active');
        }

        /*get 'href' attribute from the clicked link */
        const activeAttribute = clickedElement.getAttribute('href');

        /*find the correct article using the selector (value of 'href' attribute) */
        const clickedArticle = document.querySelector(activeAttribute);

        /*add class 'active' to the correct article */
        clickedArticle.classList.add('active');

    };

    const generateTitleLinks = function (customSelector = '') {
        /*remove contents of titleList*/
        const titleList = document.querySelector(opts.titleListSelector);

        titleList.innerHTML = '';

        /*find all the articles and save them to variable: articles*/
        const articles = document.querySelectorAll(opts.articleSelector + customSelector);

        let html = '';

        /*for all articles*/
        for (let article of articles) {
            /*get the article id*/
            const articleId = article.getAttribute('id');

            /*find the title element*/
            const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

            /*create HTML of the link using templates*/
            const linkHTMLData = {id: articleId, title: articleTitle};
            const linkHTML = templates.articleLink(linkHTMLData);

            /*insert html into variable html*/
            html = html + linkHTML;
        }
        /*insert generated html into titleList*/
        titleList.innerHTML = html;

        /*Adding event handlers to links*/
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
        };

        for(let tag in tags){
            params.max = Math.max(tags[tag], params.max);
            params.min = Math.min(tags[tag], params.min);
        };

        return params;
    };

    const calculateTagClass = function (count, params){
        const normalizedCount = count - params.min;
        const normalizedMax = params.max - params.min;
        const percentage = normalizedCount / normalizedMax;
        
        /*Converts the percentage to a scale corresponding to CSS classes */
        const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) +1);

        return opts.cloudClassPrefix + classNumber;
    };

    const generateTags = function () {
        /*create a new variable allTags with an empty object.
        Stores the number of occurrences of each tag in articles. */
        let allTags ={};

        /*find all articles */
        const articles = document.querySelectorAll(opts.articleSelector);

        /*for every article: */
        for (let article of articles) {

            /*find tags wrapper */
            const tagsList = article.querySelector(opts.articleTagsSelector);

            /*stores the generated HTML for the tags */
            let html = '';

            /*get tags from data-tags attribute */
            const articleTags = article.getAttribute('data-tags');

            /*split tags into array */
            const articleTagsArray = articleTags.split(' ');

            /*for each tag */
            for(let tag of articleTagsArray) {
                /*generate HTML of the link for tag */
                const tagHTMLData = {id: tag, title: tag};
                const tagHTML = templates.tagLink(tagHTMLData);

                /*add generated tag code to html variable for all tags */
                html = html + tagHTML;

                /*check if this link is NOT already in allTags */
                if(!allTags[tag]){
                    /*add tag to allTags object */
                    allTags[tag] = 1;
                } else {
                    allTags[tag]++;
                }
            }
            /*insert HTML of all the links into the tags wrapper */
            tagsList.innerHTML = html;
        }

        /*calculation of tag parameters */
        const tagsParams = calculateTagsParams(allTags);

        /*find list of tags in right column */
        const tagList = document.querySelector(opts.tagsListSelector);

        /*object that will be passed to the tag cloud template */
        const allTagsData ={tags: []};

        /*for each tag in allTags: */
        for(let tag in allTags){
            /*generate code of a link and add it to allTagsHTML.
            Adds a tag data object to the allTagsData.tags array*/
            allTagsData.tags.push({
                tag: tag,
                count: allTags[tag],
                className: calculateTagClass(allTags[tag], tagsParams)
            });
        }

        /*add HTML from allTagsHTML to tagList.
        Generates HTML of the tag cloud using the tagCloudLink template.*/
        tagList.innerHTML = templates.tagCloudLink(allTagsData);

        //add class=list-horizontal to tags-list in right block
        tagList.classList.add('list-horizontal');
    };

    generateTags();

    const tagClickHandler = function (event) {
        /*prevent default action for this event */
        event.preventDefault();

        /*make new constant named "clickedElement" and give it the value of "this".
        clickedElement: Stores a reference to the clicked element */
        const clickedElement = this;

        /*make a new constant "href" and read the attribute "href" of the clicked element */
        const href = clickedElement.getAttribute('href');

        /*make a new constant "tag" and extract tag from the "href" constant */
        const tag = href.replace('#tag-','');

        /*find all tag links with class="active" */
        const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

        /*for each active tag link */
        for (let activeTag of activeTags){
            /*remove class active */
            activeTag.classList.remove('active');
        }

        /*find all tag links with "href" attribute equal to the "href" constant */
        const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

        /*for each found tag link */
        for (let tagLink of tagLinks){
            /*add class active */
            tagLink.classList.add('active');
        }

        /*execute function "generateTitleLinks" with article selector as argument.
        Display only those articles whose data-tags contain the selected tag*/
        generateTitleLinks('[data-tags~="' + tag + '"]');
    };

    const addClickListenersToTags = function(){
        /*find all links to tags.
        Finding all <a> elements whose href attribute begins with #tag-. */
        const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

        /*for each link */
        for(let link of tagLinks){
            /*add tagClickHandler as event listener for that link */
            link.addEventListener('click', tagClickHandler);
        }
    };

    addClickListenersToTags();

    const generateAuthors = function () {
        /*allAuthors object stores the number of articles written by each author */
        let allAuthors = {};

        /*searches for all articles using the opts.articleSelector selector */
        const articles = document.querySelectorAll(opts.articleSelector);

        for(let article of articles){
            /*finds the element where the link to the author will be placed */
            const authorWrapper = article.querySelector(opts.articleAuthorSelector);
            /*retrieves the author name from the data-author attribute in the HTML of the article */
            const articleAuthor = article.getAttribute('data-author');
            /*creates a link to the author based on the template templates.authorLink */
            const authorHTMLData = {id: articleAuthor, title: articleAuthor};
            const authorHTML = templates.authorLink(authorHTMLData);

            /*inserts the generated author link into the article element */
            authorWrapper.innerHTML = authorHTML;

            //Article number for each author
            if(!allAuthors[articleAuthor]){
                allAuthors[articleAuthor] = 1;
            } else {
                allAuthors[articleAuthor]++;
            }
        }

        //list of authors in right column
        /*finds the item in the right panel, where the list of authors will be displayed*/
        const authorList = document.querySelector(opts.authorsListSelector);
        /*creates an object that will contain author data in the format required by the template templates.authorListLink */
        const allAuthorsData ={authors: []};
        
        /*for all authors in allAuthors object create a list of authors */
        for(let author in allAuthors){
            allAuthorsData.authors.push({
                id: author,
                title: author,
                count: allAuthors[author],
            });
        }

        /*generates HTML for the author list in the right panel using the templates.authorListLink template */
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