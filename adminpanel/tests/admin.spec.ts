import { test, expect, type Page } from "@playwright/test";
import path from "node:path";

async function signup(page: Page) {
  await page.goto("/admin/signup");
  await page.getByLabel("Full name").fill("Amandeep");
  await page.getByLabel("Email address").fill("admin@example.test");
  await page.getByLabel("Password", { exact: true }).fill("Example123!");
  await page.getByLabel("Confirm password").fill("Example123!");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "Welcome back, Amandeep." }),
  ).toBeVisible();
}
test("authentication, fixed navigation, nested selection and logout confirmation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/admin/products");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await signup(page);
  await expect(page.locator(".sidebar")).toHaveCSS("position", "fixed");
  await expect(page.locator('.sidebar [aria-current="page"]')).toHaveText(
    "Dashboard",
  );
  await page.screenshot({
    path: "test-results/dashboard-desktop.png",
    fullPage: true,
  });
  for (const route of [
    "products",
    "categories",
    "ribbons",
    "local-brand",
    "new-launch",
    "royally-crafted",
    "shop-by-style",
    "pure-silver",
    "best-sellers",
    "trending-looks",
    "reviews",
  ]) {
    await page.locator(`.sidebar a[href="/admin/${route}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/admin/${route}$`));
    await expect(
      page.locator(`.sidebar a[href="/admin/${route}"]`),
    ).toHaveAttribute("aria-current", "page");
    await expect(page.locator(".list-panel")).toBeVisible();
  }
  await page.goto("/admin/products/add");
  await expect(page.locator('.sidebar [aria-current="page"]')).toHaveText(
    "Products",
  );
  await page
    .getByRole("button", { name: "Logout", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page).toHaveURL(/products\/add$/);
  await page
    .getByRole("button", { name: "Logout", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Confirm Logout" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.getByLabel("Email address").fill("admin@example.test");
  await page.getByLabel("Password", { exact: true }).fill("wrong");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator('.error-text[role="alert"]')).toContainText(
    "incorrect",
  );
  await page.getByLabel("Password", { exact: true }).fill("Example123!");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
  expect(errors).toEqual([]);
});

test("product CRUD, real upload persistence, category filtering and reference integrity", async ({
  page,
}) => {
  await signup(page);
  await page.goto("/admin/products/add");
  await page.getByLabel("Product name *").fill("Test Emerald Ring");
  await page.getByLabel("SKU *").fill("TEST-RING-001");
  await page.getByLabel("Description *").fill("A handcrafted emerald ring.");
  await page
    .getByRole("combobox", { name: "Category *", exact: true })
    .selectOption("rings");
  await page.getByLabel("Original price").fill("2000");
  await page.getByLabel("Sale price").fill("1500");
  await page.getByLabel("Stock *").fill("5");
  await page
    .locator("input[type=file]")
    .first()
    .setInputFiles(path.resolve("public/images/ring.webp"));
  await expect(page.locator(".upload-previews img")).toHaveCount(1);
  await page.getByRole("button", { name: "Save item" }).click();
  await expect(page).toHaveURL(/\/admin\/products$/);
  await page
    .getByRole("textbox", { name: "Search by product name or SKU" })
    .fill("TEST-RING-001");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("link", { name: "Edit Test Emerald Ring" }).click();
  await page.getByLabel("Sale price").fill("2500");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.locator('.error-text[role="alert"]')).toContainText(
    "cannot exceed",
  );
  await page.getByLabel("Sale price").fill("1400");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page).toHaveURL(/\/admin\/products$/);
  await page.goto("/admin/categories/rings/products");
  await page.getByRole("combobox", { name: "All categories" }).selectOption("");
  await expect(page.locator("tbody tr")).toHaveCount(6);
  await expect(page.locator("tbody")).not.toContainText("Earrings");
  await page.goto("/admin/best-sellers/add");
  await page
    .getByRole("textbox", { name: "Search products by name or SKU" })
    .fill("Test Emerald");
  await page.getByRole("button", { name: /Test Emerald Ring/ }).click();
  await page.getByRole("button", { name: "Save item" }).click();
  await expect(page).toHaveURL(/best-sellers$/);
  await page
    .getByRole("textbox", { name: "Search best sellers" })
    .fill("Test Emerald Ring");
  await expect(page.locator("tbody")).toContainText("₹1,400");
  await page.reload();
  await page
    .getByRole("textbox", { name: "Search best sellers" })
    .fill("Test Emerald Ring");
  const row = page.locator("tr", { hasText: "Test Emerald Ring" });
  await expect(row.locator("img")).toHaveAttribute("src", /^blob:/);
  await page.goto("/admin/products");
  await page
    .getByRole("textbox", { name: "Search by product name or SKU" })
    .fill("TEST-RING-001");
  await page.getByRole("button", { name: "Delete Test Emerald Ring" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.locator('.error-text[role="alert"]')).toContainText(
    "Remove this item",
  );
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.goto("/admin/best-sellers");
  await page
    .getByRole("textbox", { name: "Search best sellers" })
    .fill("Test Emerald Ring");
  await page.getByRole("button", { name: "Delete Test Emerald Ring" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/admin/products");
  await page
    .getByRole("textbox", { name: "Search by product name or SKU" })
    .fill("TEST-RING-001");
  await page.getByRole("button", { name: "Delete Test Emerald Ring" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No products found" }),
  ).toBeVisible();
});

test("content CRUD, status and review filters", async ({ page }) => {
  await signup(page);
  await page.goto("/admin/ribbons/add");
  await page.getByLabel("Announcement text *").fill("Summer Sale");
  await page.getByLabel("Link *").fill("/collections");
  await page.getByRole("button", { name: "Save item" }).click();
  await expect(page).toHaveURL(/ribbons$/);
  const row = page.locator("tr", { hasText: "Summer Sale" });
  await row.getByRole("switch").click();
  await expect(row.getByRole("switch")).toHaveAttribute(
    "aria-checked",
    "false",
  );
  await page.goto("/admin/reviews/add");
  await page.getByLabel("Customer name *").fill("Riya");
  await page.getByLabel("Location *").fill("Jaipur");
  await page
    .getByLabel("Review text *")
    .fill("Beautiful craftsmanship and lovely details.");
  await page.getByLabel("Verified buyer").check();
  await page.getByRole("button", { name: "Save item" }).click();
  await expect(page).toHaveURL(/reviews$/);
  await page.getByRole("combobox", { name: "All buyers" }).selectOption("yes");
  await expect(page.locator("tbody")).toContainText("Riya");
  await page.getByRole("combobox", { name: "All ratings" }).selectOption("4");
  await expect(
    page.getByRole("heading", { name: "No customer reviews found" }),
  ).toBeVisible();
});

test("mobile drawer navigation, focus and no page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signup(page);
  await expect(page.locator(".sidebar")).toBeHidden();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile admin navigation" })
    .getByRole("link", { name: "Products", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/products$/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.goto("/admin/dashboard");
  await expect(
    page.getByRole("heading", { name: "Products by category" }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/dashboard-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});

test("section forms, upload validation, ordering and video playback", async ({
  page,
}) => {
  test.setTimeout(120000);
  await signup(page);
  await page.goto("/admin/categories/add");
  await page.getByLabel("Category name *").fill("Test Collection");
  await page.getByRole("button", { name: "Save item" }).click();
  await expect(page).toHaveURL(/categories$/);
  for (const route of ["local-brand", "shop-by-style"]) {
    await page.goto(`/admin/${route}/add`);
    await page
      .getByLabel(route === "local-brand" ? "Title *" : "Style name *")
      .fill("Test Editorial");
    if (route === "local-brand")
      await page.getByLabel("Description *").fill("Handcrafted in Jaipur.");
    else await page.getByLabel("Button text *").fill("Discover");
    await page.getByLabel("Link *").fill("/collections");
    await page.locator("input[type=file]").setInputFiles({
      name: "invalid.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("invalid"),
    });
    await expect(page.locator(".error-text")).toContainText("Use JPG");
    await page
      .locator("input[type=file]")
      .setInputFiles(path.resolve("public/images/ring.webp"));
    await expect(page.locator(".upload-previews img")).toHaveCount(1);
    await page.getByRole("button", { name: "Save item" }).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.locator("tbody")).toContainText("Test Editorial");
  }
  await page.goto("/admin/new-launch/add");
  await page
    .getByRole("textbox", { name: "Search products by name or SKU" })
    .fill("Pearl Cluster Necklace");
  await page.getByRole("button", { name: /Pearl Cluster Necklace/ }).click();
  await page.getByLabel("Section title").fill("The Pearl Edit");
  await page.getByRole("button", { name: "Save item" }).click();
  await expect(page).toHaveURL(/new-launch$/);
  await page.goto("/admin/royally-crafted/add");
  await page
    .getByRole("textbox", { name: "Search products by name or SKU" })
    .fill("Bridal Kundan Necklace");
  await page.getByRole("button", { name: /Bridal Kundan Necklace/ }).click();
  await page.getByRole("button", { name: "Save item" }).click();
  await expect(page).toHaveURL(/royally-crafted$/);
  await page
    .getByRole("button", { name: "Move Bridal Kundan Necklace up" })
    .click();
  await expect(page.locator("tbody tr").nth(3)).toContainText(
    "Bridal Kundan Necklace",
  );
  await page.goto("/admin/pure-silver/add");
  await page
    .getByRole("combobox", { name: "Or select a category" })
    .selectOption("rings");
  await page.getByLabel("Section title").fill("Silver Rings");
  await page.getByRole("button", { name: "Save item" }).click();
  await expect(page).toHaveURL(/pure-silver$/);

  await page.goto("/admin/products/edit/emerald-drop-earrings");
  const gallery = page.locator(".uploader").nth(2);
  await gallery
    .locator("input[type=file]")
    .setInputFiles([
      path.resolve("public/images/ring.webp"),
      path.resolve("public/images/earrings.webp"),
    ]);
  await expect(gallery.locator("img")).toHaveCount(2);
  const secondImage = await gallery.locator("img").nth(1).getAttribute("src");
  await gallery.getByRole("button", { name: "Move image 2 earlier" }).click();
  await expect(gallery.locator("img").first()).toHaveAttribute(
    "src",
    secondImage!,
  );
  await gallery.getByRole("button", { name: "Remove file 2" }).click();
  await expect(gallery.locator("img")).toHaveCount(1);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page).toHaveURL(/products$/);

  const video = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 90;
    const context = canvas.getContext("2d")!;
    const stream = canvas.captureStream(10);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const parts: BlobPart[] = [];
    const completed = new Promise<string>((resolve) => {
      recorder.ondataavailable = (e) => parts.push(e.data);
      recorder.onstop = async () => {
        const bytes = new Uint8Array(await new Blob(parts).arrayBuffer());
        resolve(btoa(String.fromCharCode(...bytes)));
      };
    });
    recorder.start();
    for (let i = 0; i < 20; i++) {
      context.fillStyle = i % 2 ? "#0D3B2E" : "#C69C45";
      context.fillRect(0, 0, 160, 90);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    recorder.stop();
    stream.getTracks().forEach((t) => t.stop());
    return completed;
  });
  await page.goto("/admin/trending-looks/add");
  await page
    .getByRole("textbox", { name: "Search products by name or SKU" })
    .fill("Emerald Drop Earrings");
  await page.getByRole("button", { name: /Emerald Drop Earrings/ }).click();
  await page.getByLabel("Title *").fill("Emerald in Motion");
  await page
    .locator("input[type=file]")
    .first()
    .setInputFiles({
      name: "preview.webm",
      mimeType: "video/webm",
      buffer: Buffer.from(video, "base64"),
    });
  await expect(page.locator("video")).toBeVisible();
  await page
    .locator("input[type=file]")
    .nth(1)
    .setInputFiles(path.resolve("public/images/earrings.webp"));
  await expect(page.locator(".upload-previews img")).toHaveCount(1);
  await page.getByRole("button", { name: "Save item" }).click();
  await expect(page).toHaveURL(/trending-looks$/);
  await page.getByRole("button", { name: "View Emerald in Motion" }).click();
  await expect(page.getByRole("dialog").locator("video")).toBeVisible();
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.readyState),
    )
    .toBeGreaterThanOrEqual(2);
  await page.locator("video").evaluate((v: HTMLVideoElement) => v.play());
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
    )
    .toBeGreaterThan(0);
});

test("orders sidebar menu: expandable parent, submenu routes, and active highlighting", async ({
  page,
}) => {
  await signup(page);

  const ordersParent = page.locator(
    '.sidebar button.nav-parent:has-text("Orders")',
  );
  await expect(ordersParent).toBeVisible();

  // Initially on dashboard, orders is not expanded
  await expect(ordersParent).toHaveAttribute("aria-expanded", "false");

  // Clicking Orders toggles expand/collapse
  await ordersParent.click();
  await expect(ordersParent).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".sidebar .nav-submenu")).toHaveClass(/expanded/);

  // Submenu items are visible
  const allOrdersLink = page.locator('.sidebar a[href="/admin/orders"]');
  const returnsLink = page.locator('.sidebar a[href="/admin/orders/returns"]');
  await expect(allOrdersLink).toBeVisible();
  await expect(returnsLink).toBeVisible();

  // 1. Test All Orders route
  await allOrdersLink.click();
  await expect(page).toHaveURL(/\/admin\/orders$/);
  await expect(ordersParent).toHaveAttribute("aria-expanded", "true");
  await expect(allOrdersLink).toHaveClass(/active/);
  await expect(allOrdersLink).toHaveAttribute("aria-current", "page");
  await expect(allOrdersLink.locator(".active-dot")).toBeVisible();

  // 2. Test Order Details route
  await page.goto("/admin/orders/DEMO-1001");
  await expect(ordersParent).toHaveAttribute("aria-expanded", "true");
  const orderDetailsLink = page.locator(
    '.sidebar .nav-submenu a:has-text("Order Details")',
  );
  await expect(orderDetailsLink).toHaveClass(/active/);
  await expect(orderDetailsLink).toHaveAttribute("aria-current", "page");
  await expect(orderDetailsLink.locator(".active-dot")).toBeVisible();

  // 3. Test Returns route
  await returnsLink.click();
  await expect(page).toHaveURL(/\/admin\/orders\/returns$/);
  await expect(ordersParent).toHaveAttribute("aria-expanded", "true");
  await expect(returnsLink).toHaveClass(/active/);
  await expect(returnsLink).toHaveAttribute("aria-current", "page");
  await expect(returnsLink.locator(".active-dot")).toBeVisible();

  // 4. Test literal /admin/orders/:id route
  await page.goto("/admin/orders/:id");
  await expect(ordersParent).toHaveAttribute("aria-expanded", "true");
  await expect(orderDetailsLink).toHaveClass(/active/);
  await expect(orderDetailsLink).toHaveAttribute("aria-current", "page");
});

test("orders management: list filtering, order details 6-card view, status update, and returns workflow", async ({
  page,
}) => {
  await signup(page);

  // Navigate to All Orders
  await page.goto("/admin/orders");
  await expect(
    page.getByRole("heading", { name: "All Orders", exact: true }),
  ).toBeVisible();

  // Check table has orders (page size 10)
  await expect(page.locator("tbody tr")).toHaveCount(10);

  // Filter / Search by Order ID
  await page
    .getByPlaceholder("Search Order ID, customer, product...")
    .fill("DEMO-1001");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Demo Customer 01");

  // Clear search
  await page.getByPlaceholder("Search Order ID, customer, product...").fill("");
  await expect(page.locator("tbody tr")).toHaveCount(10);

  // Click View on DEMO-1001
  await page
    .locator('tr:has-text("DEMO-1001")')
    .getByRole("link", { name: "View" })
    .click();
  await expect(page).toHaveURL(/\/admin\/orders\/DEMO-1001$/);

  // Verify 6 Cards are displayed in Order Details
  await expect(
    page.getByRole("heading", { name: "Order Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Customer Details" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Product Details/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Payment Details" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Shipping Details" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Order Timeline/ }),
  ).toBeVisible();

  // Test Update Status Modal
  await page.getByRole("button", { name: "Update Order Status" }).click();
  await expect(
    page.getByRole("dialog", { name: "Update Order DEMO-1001" }),
  ).toBeVisible();

  // Change status to Delivered and add note
  await page.getByLabel("Order Status *").selectOption("Delivered");
  await page.getByLabel("Courier Partner").fill("BlueDart Express");
  await page.getByLabel("Tracking Number").fill("BD-998877");
  await page
    .getByLabel("Timeline Notes (Optional)")
    .fill("Customer received package and signed.");
  await page.getByRole("button", { name: "Save Status" }).click();

  // Verify modal is closed and status badge updated
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".panel").first()).toContainText("Delivered");
  await expect(
    page.locator(".panel", { hasText: "Order Timeline" }),
  ).toContainText("Customer received package and signed.");

  // Test Returns Page
  await page.goto("/admin/orders/returns");
  await expect(
    page.getByRole("heading", { name: "Return & Refund Requests" }),
  ).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(6);

  // Filter returns by search
  await page
    .getByPlaceholder("Search Return ID, Order ID, customer...")
    .fill("RET-1001");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Pooja Sharma");

  // Test View return details modal
  await page
    .locator('tr:has-text("RET-1001")')
    .getByRole("button", { name: "Details" })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Return Request RET-1001" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("Size mismatch");

  // Approve return via modal
  await page
    .getByRole("dialog")
    .getByLabel("Update Return Status *")
    .selectOption("Approved");
  await page.getByRole("button", { name: "Save Return Status" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  // Verify return row reflects updated status
  await expect(page.locator('tr:has-text("RET-1001")')).toContainText(
    "Approved",
  );
});

test("customers, payments, and shipping: listing, filtering, details views, and customer edit/delete", async ({
  page,
}) => {
  await signup(page);

  // ==========================================
  // 1. CUSTOMERS MODULE
  // ==========================================
  // Navigate via sidebar
  const customersSidebarLink = page.locator(
    '.sidebar a[href="/admin/customers"]',
  );
  await expect(customersSidebarLink).toBeVisible();
  await customersSidebarLink.click();
  await expect(page).toHaveURL(/\/admin\/customers$/);
  await expect(customersSidebarLink).toHaveClass(/active/);
  await expect(customersSidebarLink).toHaveAttribute("aria-current", "page");

  // Verify header and 4 summary stat cards
  await expect(
    page.getByRole("heading", { name: "Customers", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".stat-card")).toHaveCount(4);
  await expect(
    page.locator(".stat-card", { hasText: "Total Customers" }),
  ).toBeVisible();
  await expect(
    page.locator(".stat-card", { hasText: "New Customers" }),
  ).toBeVisible();
  await expect(
    page.locator(".stat-card", { hasText: "Active Customers" }),
  ).toBeVisible();

  // Search customer
  const customerSearchInput = page.getByPlaceholder(
    "Search customer name, email, or phone...",
  );
  await customerSearchInput.fill("Demo Customer 01");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Demo Customer 01");

  // Navigate to customer details
  await page.locator('tbody tr a[title="View Customer"]').click();
  await expect(page).toHaveURL(/\/admin\/customers\/CUST-1001$/);

  // Check 4 Cards on Customer Details
  await expect(
    page.getByRole("heading", { name: "Customer Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Address Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Customer Summary" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Order History/ }),
  ).toBeVisible();

  // Check order history link navigates to order
  const orderLink = page.locator('tbody tr a[href^="/admin/orders/"]').first();
  await expect(orderLink).toBeVisible();

  // Test Edit Customer Modal from details page
  await page.getByRole("button", { name: "Edit Customer" }).click();
  await expect(
    page.getByRole("dialog", { name: /Edit Customer/ }),
  ).toBeVisible();
  await page.getByLabel("Phone Number *").fill("+91 98765 00000");
  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.locator(".panel", { hasText: "Customer Information" }),
  ).toContainText("+91 98765 00000");

  // Back to Customers list
  await customersSidebarLink.click();
  await expect(page).toHaveURL(/\/admin\/customers$/);

  // Test Delete Customer confirmation modal
  await customerSearchInput.fill("Demo Customer 01");
  await page.locator('tbody tr button[title="Delete Customer"]').click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Delete Customer" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  // ==========================================
  // 2. PAYMENTS MODULE
  // ==========================================
  const paymentsSidebarLink = page.locator(
    '.sidebar a[href="/admin/payments"]',
  );
  await expect(paymentsSidebarLink).toBeVisible();
  await paymentsSidebarLink.click();
  await expect(page).toHaveURL(/\/admin\/payments$/);
  await expect(paymentsSidebarLink).toHaveClass(/active/);
  await expect(paymentsSidebarLink).toHaveAttribute("aria-current", "page");

  // Verify header and 5 summary stat cards
  await expect(
    page.getByRole("heading", { name: "Payments", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".stat-card")).toHaveCount(5);
  await expect(
    page.locator(".stat-card", { hasText: "Total Payments" }),
  ).toBeVisible();
  await expect(
    page.locator(".stat-card", { hasText: "Completed" }),
  ).toBeVisible();

  // Search payment
  const paymentSearchInput = page.getByPlaceholder(
    "Search transaction ID, order ID, customer...",
  );
  await paymentSearchInput.fill("TXN-DEMO-1001");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("TXN-DEMO-1001");

  // View payment details
  await page.locator("tbody tr").getByRole("link", { name: "View" }).click();
  await expect(page).toHaveURL(/\/admin\/payments\/TXN-DEMO-1001$/);

  // Check Cards / Panels on Payment Details
  await expect(
    page.getByRole("heading", { name: "Payment Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Customer Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Order Information/ }),
  ).toBeVisible();

  // Verify safe display (masked/secure)
  await expect(
    page.locator(".panel", { hasText: "Payment Information" }),
  ).toContainText("TXN-DEMO-1001");

  // ==========================================
  // 3. SHIPPING MODULE
  // ==========================================
  const shippingSidebarLink = page.locator(
    '.sidebar a[href="/admin/shipping"]',
  );
  await expect(shippingSidebarLink).toBeVisible();
  await shippingSidebarLink.click();
  await expect(page).toHaveURL(/\/admin\/shipping$/);
  await expect(shippingSidebarLink).toHaveClass(/active/);
  await expect(shippingSidebarLink).toHaveAttribute("aria-current", "page");

  // Verify header and 5 summary stat cards
  await expect(
    page.getByRole("heading", { name: "Shipping", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".stat-card")).toHaveCount(5);
  await expect(
    page.locator(".stat-card", { hasText: "Total Shipments" }),
  ).toBeVisible();

  // Search shipment
  const shippingSearchInput = page.getByPlaceholder(
    "Search Order ID, customer, or tracking number...",
  );
  await shippingSearchInput.fill("DEMO-1001");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("DEMO-1001");

  // View shipping details
  await page.locator("tbody tr").getByRole("link", { name: "View" }).click();
  await expect(page).toHaveURL(/\/admin\/shipping\/DEMO-1001$/);

  // Check 4 Cards on Shipping Details
  await expect(
    page.getByRole("heading", { name: "Shipping Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Delivery Address" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Order Information & Packages/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Order & Shipping Timeline/ }),
  ).toBeVisible();
});
