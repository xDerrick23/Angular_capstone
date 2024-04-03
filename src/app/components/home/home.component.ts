import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="d-flex justify-content-center align-items-center w-75 mx-auto my-4">
      <div>
        <h1 class="text-center mb-4 text-primary">
          Benvenuto in CarGo!
        </h1>
<p class="text-center fs-4">CarGo e il vostro compagno di viaggio ideale, creato per trasformare ogni viaggio in un'avventura senza pensieri!
Che sia per un viaggio di lavoro, una fuga romantica o una vacanza in famiglia, CarGo mette a vostra disposizione un'ampia gamma di auto per soddisfare ogni vostra esigenza!
</p>
        <div
          id="carouselExampleIndicators"
          class="carousel slide"
          data-bs-ride="carousel"
        >
          <div class="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              class="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img
                src="https://www.inforicambi.it/public/images//auto%20da%20montagna.jpg"
                alt="Auto per montagna"
              />
              <div class="carousel-caption d-none d-md-block">
                <h5>Auto per viaggi in montagna</h5>
                <p>Veicoli ideali per avventure montane.</p>
              </div>
            </div>
            <div class="carousel-item">
              <img
                src="https://viaggiaredegustando.it/wp-content/uploads/2021/04/Road-trip.jpg"
                alt="Auto per mare"
              />
              <div class="carousel-caption d-none d-md-block">
                <h5>Auto per viaggi al mare</h5>
                <p>Perfetto per i tuoi viaggi al mare.</p>
              </div>
            </div>
            <div class="carousel-item">
              <img
                src="https://immagini.alvolante.it/sites/default/files/styles/anteprima_lunghezza_640/public/news_anteprima/2016/04/audi-forum-design-week-2016_2.jpg"
                alt="Auto per città"
              />
              <div class="carousel-caption d-none d-md-block">
                <h5>Auto per la città</h5>
                <p>Ottimo per girare la città con stile.</p>
              </div>
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .carousel-caption {
        background: rgba(0, 0, 0, 0.5);
      }

.carousel-inner img {
    height: 70vh;
    width: 100%;
    object-fit: cover;
    object-position: center center;
}

      @media (max-width: 768px) {
        .carousel-inner img {
          height: 30vh;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
