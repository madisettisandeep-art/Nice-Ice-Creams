import { NextResponse } from "next/server";
import {
  getConnectionPoolMetrics,
  getServerCacheMetrics,
} from "@/lib/db/store";

const LOAD_BALANCER_NODES = [
  { id: "nice-edge-in-hyd-1", region: "ap-south-2", weight: 50, healthy: true },
  { id: "nice-edge-in-hyd-2", region: "ap-south-2", weight: 30, healthy: true },
  { id: "nice-edge-in-blr-1", region: "ap-south-1", weight: 20, healthy: true },
];

let lbCursor = 0;

export async function GET() {
  const activeNode = LOAD_BALANCER_NODES[lbCursor % LOAD_BALANCER_NODES.length];
  lbCursor = (lbCursor + 1) % LOAD_BALANCER_NODES.length;

  return NextResponse.json(
    {
      status: "healthy",
      service: "nice-ice-creams-web",
      established: 1986,
      loadBalancer: {
        strategy: "weighted-round-robin",
        selectedNode: activeNode.id,
        region: activeNode.region,
        nodes: LOAD_BALANCER_NODES,
      },
      databasePool: getConnectionPoolMetrics(),
      queryCache: getServerCacheMetrics(),
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Upstream-Node": activeNode.id,
      },
    }
  );
}

