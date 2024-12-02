import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    
        -- Definer startdato og starttidspunkt som variabler
        DECLARE @start_date INT;
        DECLARE @start_time INT;
        SET @start_date = CAST(FORMAT(GETDATE(), 'yyyyMMdd') AS INT); -- YYYYMMDD som heltal
        SET @start_time = 104400; 
        -- Opret jobbet
        EXEC msdb.dbo.sp_add_job
        @job_name = 'UpdateMostPopularAuthor';

        -- Tilføj et jobtrin for at køre proceduren
        EXEC msdb.dbo.sp_add_jobstep
        @job_name = 'UpdateMostPopularAuthor',
        @step_name = 'RunUpdateProcedure',
        @subsystem = 'TSQL',
        @command = 'EXEC update_most_popular_author;',
        @on_success_action = 1, -- Fortsæt (ingen flere trin her)
        @on_fail_action = 2;   -- Stop ved fejl

        -- Tilføj en tidsplan for at køre hvert minut
        EXEC msdb.dbo.sp_add_jobschedule
        @job_name = 'UpdateMostPopularAuthor',
        @name = 'MinutelySchedule',
        -- @freq_type = 4, -- Dagligt
        -- @freq_interval = 1, -- Hver dag
        @freq_subday_type = 1, -- Hvert minut
        @freq_subday_interval = 1, -- Intervallet er 1 minut
        @active_start_date = @start_date, -- Brug beregnet startdato
        @active_start_time = @start_time; -- Brug beregnet starttidspunkt

        -- Tilknyt jobbet til SQL Server Agent
        EXEC msdb.dbo.sp_add_jobserver
        @job_name = 'UpdateMostPopularAuthor';
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        EXEC msdb.dbo.sp_delete_job
        @job_name = 'UpdateMostPopularAuthor';
    `);
}
