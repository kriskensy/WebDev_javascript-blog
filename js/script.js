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

        const activeLinks = document.querySelectorAll('.titles a.active');

        for (let activeLink of activeLinks) {
            activeLink.classList.remove('active');
        }

        clickedElement.classList.add('active');

        const activeArticles = document.querySelectorAll('.posts article.active');

        for (let activeArticle of activeArticles) {
            activeArticle.classList.remove('active');
        }

        const activeAttribute = clickedElement.getAttribute('href');
        const clickedArticle = document.querySelector(activeAttribute);

        clickedArticle.classList.add('active');
    };

    const generateTitleLinks = function (customSelector = '') {
        const titleList = document.querySelector(opts.titleListSelector);
        titleList.innerHTML = '';
        const articles = document.querySelectorAll(opts.articleSelector + customSelector);
        let html = '';

        for (let article of articles) {
            const articleId = article.getAttribute('id');
            const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

            const linkHTMLData = {id: articleId, title: articleTitle};
            const linkHTML = templates.articleLink(linkHTMLData);
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
        const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) +1);

        return opts.cloudClassPrefix + classNumber;
    };

    const generateTags = function () {
        let allTags ={};
        const articles = document.querySelectorAll(opts.articleSelector);

        for (let article of articles) {
            const tagsList = article.querySelector(opts.articleTagsSelector);
            let html = '';
            const articleTags = article.getAttribute('data-tags');
            const articleTagsArray = articleTags.split(' ');

            for(let tag of articleTagsArray) {
                const tagHTMLData = {id: tag, title: tag};
                const tagHTML = templates.tagLink(tagHTMLData);
                html = html + tagHTML;

                if(!allTags[tag]){
                    allTags[tag] = 1;
                } else {
                    allTags[tag]++;
                }
            }
            tagsList.innerHTML = html;
        }
        const tagsParams = calculateTagsParams(allTags);
        const tagList = document.querySelector(opts.tagsListSelector);
        const allTagsData ={tags: []};

        for(let tag in allTags){
            allTagsData.tags.push({
                tag: tag,
                count: allTags[tag],
                className: calculateTagClass(allTags[tag], tagsParams)
            });
        }
        tagList.innerHTML = templates.tagCloudLink(allTagsData);
        tagList.classList.add('list-horizontal');
    };

    generateTags();

    const tagClickHandler = function (event) {
        event.preventDefault();
        const clickedElement = this;
        const href = clickedElement.getAttribute('href');
        const tag = href.replace('#tag-','');
        const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

        for (let activeTag of activeTags){
            activeTag.classList.remove('active');
        }

        const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

        for (let tagLink of tagLinks){
            tagLink.classList.add('active');
        }
        generateTitleLinks('[data-tags~="' + tag + '"]');
    };

    const addClickListenersToTags = function(){
        const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

        for(let link of tagLinks){
            link.addEventListener('click', tagClickHandler);
        }
    };

    addClickListenersToTags();

    const generateAuthors = function () {
        let allAuthors = {};
        const articles = document.querySelectorAll(opts.articleSelector);

        for(let article of articles){
            const authorWrapper = article.querySelector(opts.articleAuthorSelector);
            const articleAuthor = article.getAttribute('data-author');
            const authorHTMLData = {id: articleAuthor, title: articleAuthor};
            const authorHTML = templates.authorLink(authorHTMLData);

            authorWrapper.innerHTML = authorHTML;

            if(!allAuthors[articleAuthor]){
                allAuthors[articleAuthor] = 1;
            } else {
                allAuthors[articleAuthor]++;
            }
        }

        const authorList = document.querySelector(opts.authorsListSelector);
        const allAuthorsData ={authors: []};
        
        for(let author in allAuthors){
            allAuthorsData.authors.push({
                id: author,
                title: author,
                count: allAuthors[author],
            });
        }
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