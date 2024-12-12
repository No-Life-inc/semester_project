import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // 1. Opret certifikat
    await knex.raw(`
        CREATE CERTIFICATE LimitedAccessCert
        ENCRYPTION BY PASSWORD = 'StrongCertPassword123!'
        WITH SUBJECT = 'Granular access for stored procedure';
    `);

    // 2. Opret bruger baseret på certifikatet
    await knex.raw(`
        CREATE USER LimitedAccessUser FROM CERTIFICATE LimitedAccessCert;
    `);

    // 3. Tildel nødvendige rettigheder til certifikatbrugeren
    await knex.raw(`
        GRANT SELECT ON dbo.book_authors TO LimitedAccessUser;
        GRANT SELECT ON dbo.user_books TO LimitedAccessUser;
        GRANT DELETE, INSERT ON dbo.most_popular_author TO LimitedAccessUser;
    `);

    // 4. Signér den eksisterende stored procedure med certifikatet
    await knex.raw(`
        ADD SIGNATURE TO OBJECT::dbo.update_most_popular_author
        BY CERTIFICATE LimitedAccessCert
        WITH PASSWORD = 'StrongCertPassword123!';
    `);

    // 5. Fjern certifikatbrugerens direkte adgang
    await knex.raw(`
        DENY CONNECT TO LimitedAccessUser;
    `);
}

export async function down(knex: Knex): Promise<void> {
    // Fjern signatur, bruger og certifikat
    await knex.raw(`
        DROP SIGNATURE FROM OBJECT::dbo.update_most_popular_author
        BY CERTIFICATE LimitedAccessCert;
    `);

    await knex.raw(`
        DROP USER LimitedAccessUser;
    `);

    await knex.raw(`
        DROP CERTIFICATE LimitedAccessCert;
    `);
}
