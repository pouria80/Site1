import { Client } from "pg";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Database connectivity test
    if (url.pathname === "/api/db-test") {
      const client = new Client({
        connectionString: env.HYPERDRIVE.connectionString,
      });

      try {
        await client.connect();

        const result = await client.query(`
          SELECT
            current_database() AS database_name,
            current_user AS database_user,
            version() AS postgres_version,
            NOW() AS server_time
        `);

        return Response.json({
          success: true,
          database: result.rows[0],
        });
      } catch (error) {
        console.error("Database connection failed:", error);

        return Response.json(
          {
            success: false,
            error: "Database connection failed",
          },
          { status: 500 }
        );
      } finally {
        try {
          await client.end();
        } catch {
          // Ignore connection close errors
        }
      }
    }

    // Everything else continues to be served by the existing static assets.
    return env.ASSETS.fetch(request);
  },
};
