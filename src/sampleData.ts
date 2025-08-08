// Sample DSL data including the FlygTaxi C4 model
export const flygTaxiDSL = `workspace "Minimal Example" {
    model {
        person1 = person "Person 1"
        system1 = softwareSystem "Software System 1"

        person1 -> system1 "Uses"
    }

    views {
        systemContext system1 "SystemContext" {
            include *
            autoLayout lr
        }
    }
}`;
