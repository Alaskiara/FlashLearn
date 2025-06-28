-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 28. Jun 2025 um 20:57
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `flashlearn`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `card`
--

CREATE TABLE `card` (
  `Card_ID` int(11) NOT NULL,
  `User_ID` int(5) NOT NULL,
  `Frage` text NOT NULL,
  `Antwort` text NOT NULL,
  `points` int(11) NOT NULL,
  `Kategorie_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Daten für Tabelle `card`
--

INSERT INTO `card` (`Card_ID`, `User_ID`, `Frage`, `Antwort`, `points`, `Kategorie_ID`) VALUES
(17, 1, 'Mathe Frage 1', 'Mathe Antwort 1', 0, 8),
(25, 1, 'OOP Frage 1', 'OOP Antwort 1', 0, 9),
(26, 1, 'IT-Projekt Frage 1', 'IT-Projekt Antwort 1', 0, 10),
(27, 1, 'Mathe Frage 2', 'Mathe Antwort 2', 0, 8);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `kategorie`
--

CREATE TABLE `kategorie` (
  `Kategorie_ID` int(11) NOT NULL,
  `Bezeichnung` varchar(50) NOT NULL,
  `User_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Daten für Tabelle `kategorie`
--

INSERT INTO `kategorie` (`Kategorie_ID`, `Bezeichnung`, `User_ID`) VALUES
(1, 'Mathe', NULL),
(2, 'OOP', NULL),
(8, 'Mathematik', 1),
(9, 'OOP', 1),
(10, 'IT-Projekt', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `User_ID` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `passwort` varchar(255) NOT NULL,
  `punkte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`User_ID`, `username`, `passwort`, `punkte`) VALUES
(1, 'test', '$2y$10$R3LuyU8S8/jSOxi4ZHLfoetKOcVDpJf9xvCbTvqzZg9GWyc9yv.YO', 0),
(2, 'abc', '$2y$10$Aj1i6Vsk07UoL4CYdZmj9e52qAyCktF/BhQb7kZUdNDG73jigmozy', 0),
(3, 'test2', '$2y$10$KNIW7icTJfJ354mhSNnnZOEqz.1LnFTgtH3QvIHCPvzvS1H1ntg2W', 0),
(4, 'asdf', '$2y$10$au6N2n68PshyGIHGm3qQGOFII2mi6fFqT/F856vc0RJoOXcdYc1re', 0);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`Card_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Kategorie_ID` (`Kategorie_ID`);

--
-- Indizes für die Tabelle `kategorie`
--
ALTER TABLE `kategorie`
  ADD PRIMARY KEY (`Kategorie_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`User_ID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `card`
--
ALTER TABLE `card`
  MODIFY `Card_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT für Tabelle `kategorie`
--
ALTER TABLE `kategorie`
  MODIFY `Kategorie_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `card`
--
ALTER TABLE `card`
  ADD CONSTRAINT `Kategorie_ID` FOREIGN KEY (`Kategorie_ID`) REFERENCES `kategorie` (`Kategorie_ID`),
  ADD CONSTRAINT `User_ID` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Constraints der Tabelle `kategorie`
--
ALTER TABLE `kategorie`
  ADD CONSTRAINT `kategorie_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
