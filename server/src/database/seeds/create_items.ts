import Knex from "knex";

export async function seed(knex: Knex) {
  await knex("items").insert([
    { title: "Lights", image: "lampadas.svg" },
    { title: "Batteries", image: "baterias.svg" },
    { title: "Paper and Cardboard", image: "papeis-papelao.svg" },
    { title: "Electronic Waste", image: "eletronicos.svg" },
    { title: "Organic", image: "organicos.svg" },
    { title: "Oil", image: "oleo.svg" },
  ]);
}
