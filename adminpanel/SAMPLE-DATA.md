# Local sample data

Run `npm run data:sample` from `adminpanel/` to populate the MySQL admin workspace using the existing jewellery catalog and sample commerce records. It is an explicit development command and does not run automatically on startup.

The command fills empty catalog sections and adds a linked sample set of orders, customers and returns when IDs do not collide. Existing records are preserved. Repeated runs do not duplicate sample records. Orders use `DEMO-` IDs and `demo: true`; customers and reviews are labeled as samples. Payments, shipping, dashboard, inventory and analytics derive their data from these records. No payments, shipments or customer notifications are sent.

Trending looks use product photos until real videos are uploaded. Settings remain editable store configuration.
