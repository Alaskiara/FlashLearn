-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 13. Mai 2025 um 22:56
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
-- Tabellenstruktur für Tabelle `championsleague`
--

CREATE TABLE `championsleague` (
  `ID` int(11) NOT NULL,
  `Frage` text NOT NULL,
  `Antwort` text NOT NULL,
  `Schwierigkeitsgrad` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `championsleague`
--

INSERT INTO `championsleague` (`ID`, `Frage`, `Antwort`, `Schwierigkeitsgrad`) VALUES
(1, 'Wer ist der Top-Torschütze der CL', 'CR7', 'leicht'),
(2, 'Wer ist amtierender CL-Sieger', 'Real Madrid', 'leicht'),
(3, 'Wer steht im CL-Finale', 'Inter Mailand und PSG', 'leicht'),
(4, 'Wo ist der Austragungsort des CL-Finales', 'München, Deutschland', 'mittel'),
(5, 'Wer ist Rekord-Sieger in der CL', 'Real Madrid', 'mittel'),
(6, 'Seit wann existiert das Ligasystem in der CL ', '2024/25', 'mittel'),
(7, 'Wie viele Mannschaften spielen im Ligasystem der CL', '36', 'schwer'),
(8, 'Wie viele Spiele muss jede Mannschaft in der Ligaphase spielen', '6 (3 Heim, 3 Auswärts)', 'schwer'),
(9, 'Welche Sportmarke stellt den Ball für die CL her', 'Adidas', 'schwer'),
(10, 'Wann war die Erstaustragung des Europapokals (Heute CL genannt)', '1955/56', 'extrem');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `championsleague`
--
ALTER TABLE `championsleague`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `championsleague`
--
ALTER TABLE `championsleague`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
