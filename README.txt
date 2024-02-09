Ashwin Kumar Injarapu - 101192135

List of files
assignment3/
│
├── views/
│   ├── pages/
│       │── createVendors.pug        | (Page used to add new vendors (functionalty will be added in Assignment 4))
│   │   ├── vendorDetails.pug        | (Lists all of the details regarding a given vendor, also contains a button that )
│   │   ├── vendors.pug              | (Page that shows all of the vendors present)
│   │   ├── modifyVendor.pu          | (Page that will take you to a page that will give you the ability to change a vendor's name, minimum order and delivery fee)
│   │   ├── addSupplyCategory.pug    | (Page that gives you the ability to add supply categories to a given vendor)
│   │   │── modifyVendorDetails.pug  | (Change vendor details that have already been added)
│	│	│── home.pug                 | (This is the home page, containing a button to the home page, that is present )
│   └
│──vendors
│	│──grand.json
│	│──indigo.json
│	│──staples.json
│
├── server.js (serves as the entry point for the application.)
├── package.json
└── README.txt
└── styles.css

	views/pages/ directory contains the PUG templates for different pages in the application. 

Installation
	Install dependencies:
	cd assignment3
	npm install
    Start the application:
	npm start
	visit http://localhost:3000 from the browser.

Usage
    Adding a Vendor
	Visit http://localhost:3000 from the browser.
	Navigate to /addvendor
	Fill in the required vendor information such as name, minimum order, and delivery fee.
	Click the "Submit" button to add the vendor.

    Viewing Vendors
	Visit http://localhost:3000 from the browser.
    Click on the "Vendors" or Navigate to /vendors page.
	Explore the list of vendors and their details.

    Modifying a Vendor
	Visit http://localhost:3000 from the browser.
	Navigate to /modifyVendor
	Enter the vendor's ID you would like to modify.
	Update the vendor details as needed.
	Click the "Submit" button to save the changes.
   
    Adding a Supply Category
	Visit http://localhost:3000 from any web browser.
    Navigate to /addSupplyCategory
	Select a vendor from the dropdown menu.
	Enter the new supply category name.
	Click the "Save" button to add the supply category.

For my stylistic design choice, I just added few things, such as changing button colors, adding slight tint to some of the containers, and making the home page more
bold.