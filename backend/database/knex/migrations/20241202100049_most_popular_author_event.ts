import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        DECLARE @start_date INT;
        DECLARE @start_time INT;
        SET @start_date = CAST(FORMAT(GETDATE(), 'yyyyMMdd') AS INT); 
        SET @start_time = 000000; 
        EXEC msdb.dbo.sp_add_job
        @job_name = 'UpdateMostPopularAuthor';

        EXEC msdb.dbo.sp_add_jobstep
        @job_name = 'UpdateMostPopularAuthor',
        @step_name = 'RunUpdateProcedure',
        @subsystem = 'TSQL',
        @command = 'USE BookCollection; EXEC update_most_popular_author;',
        @on_success_action = 1,
        @on_fail_action = 2;  

        EXEC msdb.dbo.sp_add_jobschedule
        @job_name = 'UpdateMostPopularAuthor',
        @name = 'RunDaily',
        @freq_type = 4, 
        @freq_interval = 1, 
        @active_start_date = @start_date, 
        @active_start_time = @start_time; 

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
