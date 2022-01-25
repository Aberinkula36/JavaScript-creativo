//Variables sonido
let sound, amplitude, slider, volume;
let input, analyzer, fft;

//Variables imagen
let cnv, capture;

//Variables partículas
var lines = [];
var nElipses = 60;
var elipses = [];


//Condiciones
  empezar = true;
  palmas = false;

function preload(){

//Precargamos la canción que sonará durante el programa
  sound = loadSound('assets/steps.mp3');

}

function setup() {

  frameRate(20);

//Entrada de sonido
  input = new p5.AudioIn();
  input.start();
  fft = new p5.FFT();
  fft.setInput(input);

  cnv = createCanvas(800, 800);

//Creamos los elementos que se moverán por la pantalla al ser activados
  for (var i = 0; i < nElipses; i++)
    elipses.push(crearParticula());

//Capturamos la señal de video de la webcam
  capture = createCapture(VIDEO);
  capture.hide();

//Creamos un slider para controlar el volumen
  slider = createSlider (0, 1, 0.5, 0.1);
  slider.style('width', '80px');

  amplitude = new p5.Amplitude();

//Comenzar o parar la canción cargada.
  cnv.mouseClicked(function() {
    if (sound.isPlaying() ){
      sound.stop();
      empezar = false;
      hacerPalmas();
    } else {
      empezar = true;
      sound.play();
    }
  });
}

function draw() {

  controlVolumen();

  r = random (255);
  g = random (100);
  b = random (40);

  x = random (width);
  y = random (height);
  i = random (255);
  s = random (255);

  if (empezar === false){
    hacerPalmas();
  }else{
    pulsarPantalla();
  }

  if (sound.isPlaying() ){
    camaraVideo();
  } else {
    microfonoDibuja();
  }

}

function pulsarPantalla(){

//Texto de inicio
  background(255);
  textSize(42);
  fill(0);
  text("Clica en la pantalla para oir música", 50, height/2);

}

function camaraVideo(){

  let val = slider.value();

  tint(255, 0, 0);
  image(capture, 0, 0, width, width * capture.height / capture.width);

//Usamos el filtro de "invertir" colores de la captura de video
  filter(INVERT);

//Texto que da instrucciones para continuar el programa
  fill(255);
  textAlign(CENTER);
  fill (255, 255, 0);
  text("ACTIVA TU WEBCAM", width/2, 650);
  fill (255);
  text("Pulsa las teclas A o S", width/2, 770);
  text("Clica en la pantalla para parar la música", width/2, 720);
  textSize(26);
  text("Volumen -->", 720, 790);

//Invertimos el 
  if (key === 'a'){
    filter(INVERT);
  }

  if (key === 's'){

    for(var i = 0; i < lines.length; i++){
      stroke(x, i, s);
      line(
        lines[i][0].x, lines[i][0].y,
        lines[i][1].x, lines[i][1].y,
      );
    }

    for (var j = 0; j < nElipses; j++){
      elipses[j].update();
      fill(b, i, s);
      ellipse(
        elipses[j].posicion.x,
        elipses[j].posicion.y,
        5,
        10
      );
    }

    for (var l = 0; l < nElipses; l++){
      elipses[l].update();
      fill(r, b, g);
      ellipse(
        elipses[l].posicion.y,
        elipses[l].posicion.x,
        5,
        10
      );
    }
  }

}

function controlVolumen(){

//Establecemos un controlador de volumen

  sound.setVolume(slider.value());

}

function microfonoDibuja(){

//Capturamos el sonido del micro y hacemos que se muestren unas formas según el mismo.
  let spectrum = fft.analyze();

  fill(r, g, b);
  beginShape();
  for (i = 0; i < spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0));
  }
  endShape();

}

function hacerPalmas(){

    background(0);
    fill(255);
    textSize(50);
    textAlign(CENTER);
    fill(0, 0, 255);
    text("ACTIVA TU MICRO", width/2, 200);
    fill(255);
    text("¡Haz palmas!", width/2, 300);
    text("o clica de nuevo en la pantalla", width/2, 400);
    text("para continuar", width/2, 500);

}

function crearParticula(){

  var particula = {};

//Posición aleatoria de los elementos (x, y)
  particula.posicion = createVector(
    Math.random() * width,
    Math.random() * height
    );

//Dirección aleatoria de los elementos (x, y)
  particula.direccion = createVector(
    Math.random(),
    Math.random()
    );

//Controlamos que los elementos no salgan del canvas
  particula.update = function(){

//Añadimos la dirección a la posición de los elementos
    this.posicion.add(this.direccion);
    if(this.posicion.x > width ||
      this.posicion.x < 0)
      this.posicion.x = width/3;
    if(this.posicion.y > height ||
      this.posicion.y < 0)
      this.posicion.y = height/3;
    if (this.counter > 0)
      this.counter--;
  }

//Establecemos un contador para que, durante un tiempo determinado, los elementos se puedan mover libremente
  particula.counter = 0;
  return particula;
}