## Frappe Mathlive

This Frappe app integrates MathLive, a powerful math input library, to provide an enhanced user experience for entering and editing mathematical expressions. It seamlessly replaces standard textareas in Frappe forms, including child tables, with MathLive-enabled input fields, allowing users to easily type, render, and interact with mathematical content.

### Key Features
<ul>
  <li><b>Dynamic Math Input:</b> Automatically converts Long Text fields and child table textareas into MathLive input fields, enabling users to enter math expressions intuitively.</li>
  <li>Child Table Support: Dynamically detects and integrates with all child tables in the parent form, without requiring hardcoded configurations for specific child table names.</li>
  <li>Real-Time Synchronization: Ensures that data entered via MathLive fields is saved correctly by synchronizing changes with the underlying textarea fields.</li>
  <li>Flexible Configuration: Supports any Frappe doctype setup, including user-defined child table configurations and custom fieldnames.</li>
  <li>Effortless Integration: Automatically initializes MathLive for relevant fields whenever the page or form is loaded.</li>
</ul>

## Installation Steps
### Step 1) One time to get app

```diff
bench get-app https://github.com/umar834/frappe_mathlive
```
### Step 2) to install app on any instance/site
```diff
bench --site [sitename] install-app frappe_mathlive
```

## Screenshots

![screenshot](frappe_mathlive_1.png)
![screenshot](frappe_mathlive_2.png)



#### License

MIT
