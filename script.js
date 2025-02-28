particlesJS("particles-js", {
  particles: {
    number: {
      value: 80, //number of particles
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: "#ffffff",
    },
    shape: {
      type: "circle",
      stroke:{
        width:0,
        color: "#000000",
      },
      polygon:{
        nb_slides:5,
      },
    },
    size: {
      value: 4, 
      random: true,
      anim:{
        enable:false,
        speed:30,
        size_min:0.4,
        sync:false,
      }
    },
    opacity:{
      value:0.5,
      random:false,
      anim:{
        enable:false,
        speed:1,
        opacity_min:0.5,
        sync:false,
      },
    },
    move: {
      enable: true,
      speed: 5,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX:600,
        rotateY:1200,
      },
    },
    line_linked: {
      enable: true, 
      distance: 150,
      opacity: 0.5,
      color: "#ffffff",
      width: 1.5,
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 280,
        line_linked: {
          opacity: 1,
        },
      },
      push: {
        particles_nb: 3,
      },
    },
  },
  retina_detect: true,
});

