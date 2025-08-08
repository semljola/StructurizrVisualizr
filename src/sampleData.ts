// Sample DSL data including the FlygTaxi C4 model
export const flygTaxiDSL = `workspace "FlygTaxi C4 Model" {
    model {
        # People
        traveler = person "Traveler"
        travel_agent = person "Travel Agent"
        customer = person "Customer"
        customer_support = person "Customer Support"
        price_admin = person "Price Admin (Gabi, Per-Åke)"
        ftc_operator = person "FTC Operator"
        bc_operator = person "BC Operator"
        support_manager = person "Support Manager (Tandy)"

        # FlygTaxi Software System
        flygtaxi_system = softwareSystem "FlygTaxi System" "All the subsystems of FlygTaxi" {
            eko_subsystem = container "EKO Subsystem" "File import of ready bookings from FTRES. Creates Invoicing and settlements. Accounting is sent to VISMA."
            ftbook_subsystem = container "FTBook Subsystem" "FlygTaxi bookings (book.flygtaxi.se) for travel agents, customers and customer support."
            iata_subsystem = container "IATA Subsystem" "Polls SITA subsystem for bookings, convert these to text files and finally inserted into the database."
            ftres_subsystem = container "FTRES Subsystem" "Stores and manage all bookings in internal format. Exports ready dispatches every day as files."
            sita_subsystem = container "SITA Subsystem" "Receives SITA messages from Amadeus and similar networks. Messages are pushed into local hosted ActiveMQ queue."
            flink_subsystem = container "FLINK Subsystem" "FLINK sends SUTI messages to correct Trafikledningscentral."
            statistik_subsystem = container "Statistik Subsystem" "File import of ready bookings from FTRES. Creates Invoicing and settlements. Accounting is sent to VISMA."
            flygtaxi_se_subsystem = container "FlygTaxi SE Subsystem" "The new www.flygtaxi.se web"
            microsoft_access_subsystem = container "Microsoft Access Subsystem" "20+ MS Access databases and macros for price administration"
            voice_provider_subsystem = container "Voice Provider Subsystem" "SOAP Webservice layer used by voiceprovider.se"
            transfer_web_subsystem = container "Transfer Web Subsystem" "Separate FlygTaxi booking web for Åre, Piteå, Vendalen and Karlskrona"
        }

        # External Systems
        cirium_flightstats = softwareSystem "CIRIUM Flightstats" "Rest API finding flights (departs/arrivals) and airports" "External"
        flygbussar = softwareSystem "Flygbussar" "Flygbuss tickets are purchased by the traveler, and the tickets is sent to the traveler by Flygbuss" "External"
        riksbanken = softwareSystem "Riksbanken" "Rest API for all exchange rates" "External"
        amadeus = softwareSystem "Amadeus" "Travel Agent books on behalf of a traveler or customer" "External"
        trainplanet = softwareSystem "Trainplanet" "Cloud based travel booking site for Travelers with an integration to FlygTaxi" "External"
        air_plus = softwareSystem "Air Plus" "Air Plus Card Travel Accounts (Lufthansa). Used for Cabonline App, nothing else" "External"
        inexchange = softwareSystem "Inexchange" "Invoicing and E-Faktura (authority customers like Kammarkollegiet)" "External"
        here_maps = softwareSystem "Here Maps" "Using its API to fetch distances between local areas, airports and train stations. Also durations to travel." "External"
        dnb_bisnode = softwareSystem "DNB / BISNODE" "FlygTaxi purchase address data from Dun & Bradsteeet" "External"
        nordic_travel_clearing = softwareSystem "Nordic Travel Clearing" "För debitering på Resekonto, kontakt med alla banker samt kortbolagen.  American Express BTA Diners Club TAC First Card" "External"
        sms_provider = softwareSystem "SMS Provider" "" "External"
        swedbank_pay = softwareSystem "Swedbank Pay" "Customer pays using Swish, Debit or Credit Card, (aretransfer.se and new flygtaxi.se)" "External"
        amadeus_cytric = softwareSystem "Amadeus Cytric" "Larger corporations normally, let travelers book travels themselves?" "External"
        trafiklab = softwareSystem "Trafiklab" "Download files..." "External"
        travelport = softwareSystem "Travelport" "Travel Agent books on behalf of a traveler or customer" "External"
        cabonline_system = softwareSystem "Cabonline System" "All the subsystems of Cabonline" "External"
        tripracer_com = softwareSystem "Tripracer.com" "Cloud based self booking site" "External"
        voice_provider = softwareSystem "Voice Provider" "Traveler solution for booking via voice (https://voiceprovider.se).  Mainly not in use!" "External"
        egencia = softwareSystem "Egencia" "Invoicing and E-Faktura (Egencia customers)" "External"
        swedavia = softwareSystem "Swedavia" "Departures and Arrivals" "External"
        trafikledningssystem = softwareSystem "Trafikledningssystem" "iCabbi, Frogne etc manages a network of Transporters for an arial zone" "External"
        silverrail = softwareSystem "Silverrail" "Travel Agent books on behalf of a traveler or customer" "External"
        small_transporters = softwareSystem "Small Transporters" "Email to small transporters mostly in sparsely populated areas" "External"
        flygbuss_via_turnit_com = softwareSystem "Flygbuss via Turnit.com" "Central Passenger Service System for Ground Transport. Flygbuss tickets is sent to traveler." "External"
        mobilexpense_mxp = softwareSystem "MobileXpense (Mxp)" "Mobile expence for certain organizations" "External"
        arlandaexpress = softwareSystem "Arlandaexpress" "Arlandaexpress tickets are purchased by the traveler, and the tickets is sent to the traveler by Arlandaexpress" "External"
        customers = softwareSystem "Customers" "Invoicing/notifying directly to customers" "External"
        sabre = softwareSystem "Sabre" "Travel Agent books on behalf of a traveler or customer" "External"
        sas = softwareSystem "SAS" "SAS Traveler self booking" "External"
        citycity = softwareSystem "CityCity" "Cloud-based platform for Travel Agencies with an integration to FlygTaxi" "External"
        amadeus_offline = softwareSystem "Amadeus Offline" "GGSUR or AIS-pages in Amadeus" "External"
        icabbi = softwareSystem "iCabbi" "There are many instances of iCabbi (Stockholm, Sweden, Denmark, Finland)" "External"
        frogne = softwareSystem "Frogne" "There are many instances of Frogne (Kurir Stockholm, Kurir Sweden, SVT Sweden, Umeå... etc)" "External"
        vinka = softwareSystem "VINKA" "Bla ..." "External"
        amex_gbt_neo = softwareSystem "Amex GBT Neo" "Amex self booking system. Travelers books." "External"

        # Key Relationships
        traveler -> flygtaxi_system "Books rides"
        travel_agent -> flygtaxi_system "Books on behalf of travelers"
        customer -> flygtaxi_system "Makes bookings"
        customer_support -> flygtaxi_system "Manages customer issues"
        price_admin -> flygtaxi_system "Updates pricing"
        
        flygtaxi_system -> amadeus "Receives bookings"
        flygtaxi_system -> cirium_flightstats "Gets flight information"
        flygtaxi_system -> here_maps "Calculates distances"
        flygtaxi_system -> swedbank_pay "Processes payments"
        flygtaxi_system -> sms_provider "Sends notifications"
        
        flygtaxi_system.ftbook_subsystem -> flygtaxi_system.ftres_subsystem "Stores bookings"
        flygtaxi_system.eko_subsystem -> flygtaxi_system.ftres_subsystem "Processes completed bookings"
        flygtaxi_system.iata_subsystem -> flygtaxi_system.sita_subsystem "Polls for bookings"
        flygtaxi_system.flink_subsystem -> trafikledningssystem "Sends dispatch messages"
    }

    views {
        systemContext flygtaxi_system "FlygTaxiSystemContext" {
            include *
            autoLayout lr
        }

        container flygtaxi_system "FlygTaxiContainer" {
            include *
            autoLayout lr
        }

        styles {
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            element "Container" {
                background #438dd5
                color #ffffff
            }
            element "Person" {
                background #08427b
                color #ffffff
                shape Person
            }
            element "Database" {
                shape Cylinder
            }
            element "External" {
                background #999999
                color #ffffff
            }
        }
    }
}`;

// Simple e-commerce example for comparison
export const simpleEcommerceDSL = `workspace "Simple E-commerce System" {
    model {
        # People
        customer = person "Customer" "A customer using the e-commerce platform"
        admin = person "Admin" "System administrator"
        
        # Software Systems
        ecommerceSystem = softwareSystem "E-commerce System" "Provides online shopping functionality" "Spring Boot"
        paymentGateway = softwareSystem "Payment Gateway" "Processes payments" "External"
        inventorySystem = softwareSystem "Inventory System" "Manages product inventory" "External"
        
        # Containers
        ecommerceSystem.webApp = container "Web Application" "Provides web interface" "React"
        ecommerceSystem.api = container "API Gateway" "Provides REST API" "Spring Boot"
        ecommerceSystem.database = container "Database" "Stores application data" "PostgreSQL"
        
        # Relationships
        customer -> ecommerceSystem.webApp "Uses"
        ecommerceSystem.webApp -> ecommerceSystem.api "Calls"
        ecommerceSystem.api -> ecommerceSystem.database "Stores data"
        ecommerceSystem.api -> paymentGateway "Processes payments"
        ecommerceSystem.api -> inventorySystem "Checks inventory"
        admin -> ecommerceSystem.api "Manages"
    }
    
    views {
        systemContext ecommerceSystem "SystemContext" {
            include *
            autoLayout lr
        }
        
        container ecommerceSystem "Containers" {
            include *
            autoLayout lr
        }
    }
}`;
