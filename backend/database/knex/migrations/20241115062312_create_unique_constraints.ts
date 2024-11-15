exports.up = async function(knex) {
    // Alter `isbn` to be not nullable and unique
    await knex.schema.alterTable('books', (table) => {
      table.string('isbn', 255).notNullable().alter();
      table.unique(['isbn']);
    });
  
    await knex.schema.alterTable('authors', (table) => {
      table.string('name', 255).notNullable().alter();
      table.unique(['name']);
    });
  
    await knex.schema.alterTable('publishers', (table) => {
      table.string('name', 255).notNullable().alter();
      table.unique(['name']);
    });
  
    await knex.schema.alterTable('tags', (table) => {
      table.string('name', 255).notNullable().alter();
      table.unique(['name']);
    });
  
    await knex.schema.alterTable('subjects', (table) => {
      table.string('name', 255).notNullable().alter();
      table.unique(['name']);
    });
  };
  
  exports.down = async function(knex) {
    await knex.schema.alterTable('books', (table) => {
      table.dropUnique(['isbn']);
      table.string('isbn', 255).nullable().alter();
    });
  
    await knex.schema.alterTable('authors', (table) => {
      table.dropUnique(['name']);
      table.string('name', 255).nullable().alter();
    });
  
    await knex.schema.alterTable('publishers', (table) => {
      table.dropUnique(['name']);
      table.string('name', 255).nullable().alter();
    });
  
    await knex.schema.alterTable('tags', (table) => {
      table.dropUnique(['name']);
      table.string('name', 255).nullable().alter();
    });
  
    await knex.schema.alterTable('subjects', (table) => {
      table.dropUnique(['name']);
      table.string('name', 255).nullable().alter();
    });
  };
  