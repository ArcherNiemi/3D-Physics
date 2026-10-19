
def dot(a, b):
    return a[0] * b[0] + a[1] * b[1]


def get_axes(polygon):
    axes = []

    for i in range(len(polygon)):
        p1 = polygon[i]
        p2 = polygon[(i + 1) % len(polygon)]

        # Edge vector
        edge = (p2[0] - p1[0], p2[1] - p1[1])

        # Perpendicular vector (normal)
        axis = (-edge[1], edge[0])
        axes.append(axis)

    return axes


def project(polygon, axis):
    projections = [dot(vertex, axis) for vertex in polygon]
    return min(projections), max(projections)


def overlap_on_axis(a, b, axis):
    min_a, max_a = project(a, axis)
    min_b, max_b = project(b, axis)

    return not (max_a < min_b or max_b < min_a)


def polygons_collide(a, b):
    # Check normals from both polygons
    for axis in get_axes(a) + get_axes(b):
        if not overlap_on_axis(a, b, axis):
            return False

    return True


# Example: two axis-aligned squares
A = [(0, 0), (2, 0), (2, 2), (0, 2)]
B = [(1, 1), (3, 1), (3, 3), (1, 3)]
C = [(3, 0), (5, 0), (5, 2), (3, 2)]

print(polygons_collide(A, B))  # True: overlap
print(polygons_collide(A, C))  # False: only share an edge
