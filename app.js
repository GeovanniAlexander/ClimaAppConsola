const inquirer = require("./helpers/inquirer");
const Busqueda = require("./models/busqueda");

const main = async () => {

  const busqueda = new Busqueda;
  let opc;
  do {

    opc = await inquirer.inquirerMenu();
    
    switch(opc){
      case 1:
        //leer la ciudad 
        const termino = await inquirer.leerInput("Ciudad: ");
        // buscar lugar
        const lugares = await busqueda.ciudad(termino);
        // listar lugares
        const id = await inquirer.listarLugares(lugares);
        const lugarSel = lugares.find( i => i.id === id);
        if(id === "0") continue
        else busqueda.guardar(lugarSel.nombre);
        // buscar clima
        const clima = await busqueda.clima(lugarSel.lat, lugarSel.lng);

        console.clear();
        console.log("\nInformacion de la ciudad:\n".green);
        console.log("nombre:", lugarSel.nombre)
        console.log("Lng:", lugarSel.lng);
        console.log("Lat:", lugarSel.lat);
        console.log("Temperatura:", clima.temp);
        console.log("Minima:", clima.min);
        console.log("Maxima:", clima.max);
        console.log("Descripcion:", clima.desc);
      break;

      case 2:
        busqueda.historialCap.forEach( (lugar, i) => console.log( `${ i+1 }`.green, lugar));
      break;
    }

    if (opc != 0) await inquirer.pausa();
  } while (opc != 0);
};

main();
