import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('points', table => {
        table.increments('id').primary();
        table.string('image').notNullable().defaultTo("https://increasify.com.au/wp-content/uploads/2016/08/default-image.png");
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('phone').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('address').notNullable();
        table.string('suburb').notNullable();
        table.string('city').notNullable();
        table.string('region').notNullable();
        table.string('postcode').notNullable();
    })

}
export async function down(knex: Knex) { 
    return knex.schema.dropTable('point');
}