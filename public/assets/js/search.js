async function handleInput(e) {
    try {
        const res = await fetch(
            "/api/characters?name=" + e.target.value.toLowerCase().trim()
        );
        const character = await res.json();
        injectCharacterToDOM(character);
    } catch (error) {
        console.log(error);
    }
}

function injectCharacterToDOM(character) {
    const characterContainer = document.querySelector(".character-container");
    characterContainer.innerHTML = "";
    if (!character.length) {
        characterContainer.innerHTML = `<h2>Aucun personnage trouvé</h2>`;
        return;
    }
    character.forEach((character) => {
        characterContainer.innerHTML += `
            <div class="character">
            
                <a
                    href="/liste-personnages/${character.id}"
                    className="cta-modal"
                    title="vers la fiche de détail"
                >
                    <figure>
                        <figcaption>${character.title1}</figcaption>

                        <img src="/img/${character.src}" alt="${character.alt}" />
                    </figure>
                </a>
            </div>
        `;
    });
}

const search = document.querySelector("#search");

if(search) search.addEventListener("input", handleInput);
