define(["jquery", "session"], function($, Session) {
    var Lang = {
        pl: {
            spalanie: "Spalanie",
            cena: "Cena",
            koszt: "Koszt",
            na: "na",
            brak_informacji: "Brak informacji aby obliczyć spalanie",
            do_pelna: "do pełna",
            byla_rezerwa: "była rezerwa",
            zatankowano: "Zatankowano",
            pole_wymagane: "Pole wymagane",
            to_nie_jest_liczba: "To nie jest liczba",
            przebieg_za_maly: "Przebieg jest mniejszy niż podczas poprzedniego tankowania z listy",
            przebieg_za_duzy: "Przebieg jest większy niż podczas następnego tankowania z listy",
            data_pozniejsza: "Data jest późniejsza niż następne tankowanie z listy",
            data_wczesniejsza: "Data jest wcześniejsza niż poprzednie tankowanie z listy",
            // synchronizacja
            to_nie_jest_email: "To nie jest adres email",
            zle_potwierdzenie_hasla: "Hasło jest źle potwierdzone",
            haslo_za_krotkie: "Hasło za krótkie, przynajmniej 3 znaki",
            prosze_czekac: "Proszę czekać",
            dane_zapisane_na_serwerze: "Dane zostały zapisane na serwerze",
            dane_pobrane_z_serwera: "Dane zostały pobrane z serwera",
            problem_z_polaczeniem: "Problem w komunikacji, sprawdz połączenie internetem lub spróbuj ponownie póżniej",
            informacja: "Informacja"
        },
        en: {
            wroc: "back",
            ustawienia: "Settings",
            jednostka_dlugosci: "Distance unit",
            jednostka_dlugosci_inna: "Other unit",
            jednostka_pojemnosci: "Capacity unit",
            jednostka_pojemnosci_inna: "Other unit",
            waluta: "Currency",
            waluta_inna: "Other currency",
            jezyk: "Language",
            zapisz: "Save",
            opcje: "options",
            wykres: "Graph",
            spalanie: "Fuel consumption",
            cena: "Price",
            koszt: "Cost",
            typ: 'Type',
            miesieczny: 'Monthly',
            szczegolowy: 'Details',
            tankuje: "Add log",
            tankowanie: "Refueling",
            pojazdy: "Vehicles",
            podsumowanie: "Summary",
            odswiez: "Refresh",
            ostrzezenie: "Warning",
            na: "per",
            brak_informacji: "No information to calculate fuel consumption",
            do_pelna: "fill up",
            byla_rezerwa: "reserve",
            zatankowano: "Amount of fuel",
            edycja: "Edit",
            usun: "Delete",
            na_pewno_usunac: "Are you sure to delete this refueling?",
            ilosc_paliwa: "The amount of fuel",
            anuluj: "Cancel",
            przebieg: "Mileage",
            wlane_paliwo: "Amount of fuel",
            wybierz_date: "Choose date",
            aktualny_przebieg: "Current mileage",
            ostatnio: "last",
            ilosc_wlanego_paliwa: "Amount of fuel",
            cena_za: "Price per",
            informacje_dodatkowe: "Additional Information",
            data: "Date",
            pole_wymagane: "Required field",
            to_nie_jest_liczba: "It is not a number",
            przebieg_za_maly: "Mileage is smaller than during the previous refueling from the list",
            przebieg_za_duzy: "Mileage is greater than the next filling from the list",
            data_pozniejsza: "The date is later than the next refueling from a list",
            data_wczesniejsza: "The date is earlier than the previous refueling from a list",
            nowy: "New",
            na_pewno_usunac_auto: "Are you sure to delete this vehicle ?",
            marka_model: "Brand and model",
            silnik: "Engine",
            nowy_pojazd: "New vehicle",
            wiecej: "more",
            paliwo: "Fuel",
            srednie: 'Average',
            minimalne: 'Minimum',
            maksymalne: 'Maximum',
            calkowity: 'Total',
            sredni_koszt_tankowania: 'Average cost of refueling',
            najdrozsze_tankowanie: 'The most expensive refueling',
            najtansze_tankowanie: 'The cheapest refueling',
            sredni_przebieg_miedzy_tankowaniami: 'Average mileage between refueling',
            najwiekszy_przebieg_miedzy_tanowaniami: 'The largest mileage between refueling',
            najmniejszy_przebieg_miedzy_tankowaniami: 'The smallest mileage between refueling',
            cale_zuzyte_paliwo: 'All fuel consumed',
            srednia_tankowana_ilosc: 'Average refueled amount',
            najwieksza_tankowana_ilosc: 'The largest refueled amount',
            najmniejsza_tankowana_ilosc: 'The smallest refueled amount',
            // synchronizacja
            to_nie_jest_email: "This is not valid email",
            zle_potwierdzenie_hasla: "Password confirmation is not valid",
            haslo_za_krotkie: "Password too short, at least 3 chars",
            synchronizacja: "Synchronization",
            twoje_konto: "Your account",
            haslo: "Password",
            haslo2: "Confirm password",
            logowanie: "Login",
            utworz_konto: "Create new account",
            utworz: "Create",
            mam_konto: "I have account",
            eksport_label: "Export",
            import_label: "Import",
            pojazdy_urzadzenie: "Vehicles on device",
            pojazdy_serwer: "Vehicles on server",
            zapisz_na_serwerze: "Upload to server",
            pobierz_z_serwera: "Download from server",
            prosze_czekac: "Please wait",
            dane_zapisane_na_serwerze: "Data has been uploaded on server",
            dane_pobrane_z_serwera: "Data has bean downloaded from server",
            problem_z_polaczeniem: "Network communication problem, check your internet connection or try again later",
            informacja: "Information",
            data_synchronizacji: "Date of synchronization",
            zapisz_na_serwer_info: "Entries from SELECTED VEHICLES will be stored on the server. At any time, you can upload it back to the device. These data are associated with your account, so using the given email address and password, you can upload on any other device. If NOT SELECTED VEHICLES are already on the server, it will be removed from it.",
            pobierz_z_serwera_info: "SELECTED VEHICLES data will be retrieved from the server and loaded on your device. Pay attention to the DATA OF LAST SYNC, because if downloaded vehicles are already on the device it will be replaced by data that is retrieved from the server.",
            domyslnie_zaznaczony: "Vehicle will be default checked during synchronization",
            keyboard: "Keyboard for numbers",
            keyboard_num: "Numerical",
            keyboard_def: "Default"
        },
        de: {
            wroc: "Zurück",
            ustawienia: "Einstellungen",
            jednostka_dlugosci: "Längeneinheit",
            jednostka_dlugosci_inna: "Andere Einheit",
            jednostka_pojemnosci: "Kapazität Einheit",
            jednostka_pojemnosci_inna: "Andere Einheit",
            waluta: "Währung",
            waluta_inna: "Andere Währung",
            jezyk: "Sprache",
            zapisz: "Speichern",
            opcje: "Optionen",
            wykres: "Graph",
            spalanie: "Verbrennung",
            cena: "Preis",
            koszt: "Kosten",
            typ: 'Typ',
            miesieczny: 'Monatlich',
            szczegolowy: 'Details',
            tankuje: "Tanken",
            tankowanie: "Tanken",
            pojazdy: "Fahrzeuge",
            podsumowanie: "Zusammenfassung",
            odswiez: "Refresh",
            ostrzezenie: "Warning",
            na: "pro",
            brak_informacji: "Keine Information, um die Verbrennung zu berechnen",
            do_pelna: "full tanken",
            byla_rezerwa: "reserve",
            zatankowano: "Betankt",
            edycja: "Bearbeiten",
            usun: "Löschen",
            na_pewno_usunac: "Sind Sie sicher, dass diese Tanken zu löschen",
            ilosc_paliwa: "Die Menge an Kraftstoff",
            anuluj: "Abbrechen",
            przebieg: "Kilometerstand",
            wlane_paliwo: "Treibstoffmenge",
            wybierz_date: "Datum wählen",
            aktualny_przebieg: "Aktuelle Laufleistung",
            ostatnio: "last",
            ilosc_wlanego_paliwa: "Treibstoffmenge betankt",
            cena_za: "Preis pro",
            informacje_dodatkowe: "Weitere Informationen",
            data: "Datum",
            pole_wymagane: "Pflichtfeld",
            to_nie_jest_liczba: "Es ist keine Zahl",
            przebieg_za_maly: "Mileage kleiner ist als während der vorherigen Tanken aus der Liste",
            przebieg_za_duzy: "Mileage größer ist als die nächste Füllung aus der Liste",
            data_pozniejsza: "Das Datum ist später als die nächste Betankung aus einer Liste",
            data_wczesniejsza: "Das Datum ist älter als die vorherige Tanken aus einer Liste",
            nowy: "Neu",
            na_pewno_usunac_auto: "Sind Sie sicher, um dieses Fahrzeug zu löschen",
            marka_model: "Marke und Modell",
            silnik: "Engine",
            nowy_pojazd: "Neues Fahrzeug",
            wiecej: "mehr",
            paliwo: "Kraftstoff",
            srednie: "Durchschnitt",
            minimalne: 'Minimum',
            maksymalne: 'Maximum',
            calkowity: 'Total',
            sredni_koszt_tankowania: "Durchschnittliche Kosten für Betankung",
            najdrozsze_tankowanie: "Die teuersten Tanken",
            najtansze_tankowanie: 'Die billigste Tankstellen',
            sredni_przebieg_miedzy_tankowaniami: "Durchschnittliche Laufleistung zwischen Tanken",
            najwiekszy_przebieg_miedzy_tanowaniami: 'Die größte Autos zwischen Tanken',
            najmniejszy_przebieg_miedzy_tankowaniami: "Kleinste Autos zwischen Tanken",
            cale_zuzyte_paliwo: 'All Kraftstoff verbraucht',
            srednia_tankowana_ilosc: "Durchschnittlich aufgetankt Betrag",
            najwieksza_tankowana_ilosc: 'Die größte Menge getankt',
            najmniejsza_tankowana_ilosc: "Der kleinste Betrag betankt",
            // Synchronizacja
            to_nie_jest_email: "Dies ist keine gültige E-Mail",
            zle_potwierdzenie_hasla: "Passwort-Bestätigung ist nicht gültig",
            haslo_za_krotkie: "Passwort zu kurz ist, mindestens 3 Zeichen",
            synchronizacja: "Synchronisation",
            twoje_konto: "Ihr Konto",
            haslo: "Password",
            haslo2: "Confirm password",
            logowanie: "Login",
            utworz_konto: "Neues Konto erstellen",
            utworz: "Erstellen",
            mam_konto: "Ich habe Konto",
            eksport_label: "Export",
            import_label: "Import",
            pojazdy_urzadzenie: "Fahrzeuge auf dem Gerät",
            pojazdy_serwer: "Fahrzeuge auf dem Server",
            zapisz_na_serwerze: "Zum Server hochladen",
            pobierz_z_serwera: "Von server Download",
            prosze_czekac: "Bitte warten",
            dane_zapisane_na_serwerze: "Data hat auf dem Server hochgeladen",
            dane_pobrane_z_serwera: "Data hat Bohne vom Server heruntergeladen",
            problem_z_polaczeniem: "Netzwerkkommunikation Problem, überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später noch einmal",
            informacja: "Information",
            data_synchronizacji: "Datum der Synchronisation",
            zapisz_na_serwer_info: "Einträge aus ausgewählten Fahrzeuge werden auf dem Server gespeichert werden, jederzeit, können Sie es hochladen zurück zum Gerät Diese Daten mit Ihrem Konto verknüpft sind, so unter Verwendung der angegebenen E-Mail-Adresse und Ihrem Passwort können Sie auf jedem anderen hochladen.. Gerät. falls nicht gewählt Fahrzeuge, die bereits auf dem Server, wird es von ihm entfernt werden.",
            pobierz_z_serwera_info: "Ausgewählte Fahrzeuge Daten werden vom Server abgerufen und geladen werden auf Ihrem Gerät Achten Sie auf die Daten der letzten SYNC, denn wenn heruntergeladen Fahrzeuge sind bereits auf dem Gerät durch Daten, die vom Server abgerufen wird ersetzt werden.",
            domyslnie_zaznaczony: "Fahrzeug wird standardmäßig während der Synchronisierung überprüft werden",
            keyboard: "Keyboard für Zahlen",
            keyboard_num: "Numerical",
            keyboard_def: "Default"
        },
        /**
         * metoda do tlumaczenia tekstow
         */
        translate: function(element, lang) {

            if (typeof lang === "undefined") {
                lang = Session.lang;
            }
            if (lang === null) {
                lang = "en";
            }

            var words = this[lang];

            if (typeof words === "undefined") {
                return false;
            }
            var elementObj = $(element);
            elementObj.find("[data-lang]").each(function(index, one) {

                one = $(one);
                var name = one.data('lang');
                //console.log(name);

                var word = words[name];
                if (typeof word !== "undefined") {
                    var tag = one.get(0).tagName;

                    switch (tag) {
                        case 'INPUT' :
                            one.attr('placeholder', word);
                            break;
                        default:
                            one.text(word);
                    }
                    //console.log(tag);
                }
            })

            return elementObj;
        },
        getText: function(name, lang) {

            if (typeof lang === "undefined") {
                lang = Session.lang;
            }
            if (lang === null) {
                lang = "en";
            }

            var words = this[lang];

            if (typeof words === "undefined") {
                return false;
            }

            var word = words[name];
            if (typeof word === "undefined") {
                return false;
            }

            return word;
        }
    }

    return Lang;
});