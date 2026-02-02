<?php
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/sourcequery/vendor/autoload.php';

use xPaw\SourceQuery\SourceQuery;

/* CONFIG */
$SERVER_IP   = 'serverip';
$SERVER_PORT = 27015;
$TIMEOUT     = 1;
$query = new SourceQuery();

try {
    $query->Connect($SERVER_IP, $SERVER_PORT, $TIMEOUT, SourceQuery::SOURCE);

    $Info       = $query->GetInfo();
    $PlayersRaw = $query->GetPlayers();

    $Players = [];

    foreach ($PlayersRaw as $p) {
        if (empty($p['Name'])) continue;

        $Players[] = [
            "Name"  => (string)$p["Name"],
            "Dosh" => isset($p["Score"]) ? (int)$p["Score"] : 0,
            "Time" => isset($p["Time"])?
             sprintf('%02d:%02d DK', 
             floor($p["Time"] / 3600), 
             floor(($p["Time"] % 3600) / 60)): "00:00"

        ];
    }

    echo json_encode([
        "online"     => true,
        "name"       => $Info['HostName'] ?? '',
        "map"        => $Info['Map'] ?? '',
        "mode"       => $Info['GameDescription'] ?? '',
        "players"    => $Info['Players'] ?? 0,
        "max"        => $Info['MaxPlayers'] ?? 0,
        "playerlist" => $Players
    ]);

} catch (Throwable $e) {

    http_response_code(200);
    echo json_encode([
        "online" => false,
        "error"  => $e->getMessage()
    ]);

} finally {
    /* SAFE even if connect failed */
    if (isset($query)) {
        $query->Disconnect();
    }
}
