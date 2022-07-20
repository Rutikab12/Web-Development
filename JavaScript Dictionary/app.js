let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = '581344d0-4ef6-4804-a141-392d32122ddf';
let notfound = document.querySelector('.not-found');
let defbox = document.querySelector('.def');
let loading = document.querySelector('.loading');
let audioBox = document.querySelector('.audio');
searchBtn.addEventListener('click', function(e) {
    e.preventDefault();

    //clear data
    audioBox.innerHTML = '';
    notfound.innerText = '';
    defbox.innerText = '';

    //get input data
    let search = input.value;

    //call API get data
    if (search === '') {
        alert('Please enter a word');
        return;
    }

    getData(search);
});

async function getData(word) {
    loading.style.display = 'block';
    //AJAX call for API
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`);

    const data = await response.json();
    //console.log(data);

    //if empty result
    if (!data.length === 0) {
        //alert('No results found');
        loading.style.display = 'none';
        notfound.innerText = ' No Result Found';
        return;
    }

    //if result is suggestion
    if (typeof data[0] === 'string') {
        loading.style.display = 'none';
        let heading = document.createElement('h2');
        heading.innerText = 'Suggestions';
        notfound.appendChild(heading);
        // data.forEach(function(item) {
        //     let suggestion = document.createElement('p');
        //     suggestion.innerText = item;
        //     notfound.appendChild(suggestion);
        // })
        data.forEach(item => {
            let suggestion = document.createElement('span');
            suggestion.classList.add('suggested');
            suggestion.innerText = item;
            notfound.appendChild(suggestion);
        })
        return;
    }

    //result display
    loading.style.display = 'none';
    let defination = data[0].shortdef[0];
    defbox.innerText = defination;

    // for Sound output 
    const soundName = data[0].hwi.prs[0].sound.audio;
    if (soundName) {
        renderSound(soundName);
    }

    console.log(data);

}


function renderSound(soundName) {
    // https://media.merriam-webster.com/soundc11
    let subfolder = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;

    let aud = document.createElement('audio');
    aud.src = soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);

}